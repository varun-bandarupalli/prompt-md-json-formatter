import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function App() {
  const [prompts, setPrompts] = useState({})
  const [fileName, setFileName] = useState('')
  const [textareaHeights, setTextareaHeights] = useState({})
  const [newKeyName, setNewKeyName] = useState('')
  const [showAddKey, setShowAddKey] = useState(false)
  const [copiedStates, setCopiedStates] = useState({})
  const textareaRefs = useRef({})

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result)
          setPrompts(json)
        } catch (error) {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  const handlePromptChange = (key, value) => {
    setPrompts(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const insertMarkdown = (key, before, after = '') => {
    const textarea = textareaRefs.current[key]
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = prompts[key]
    const selectedText = text.substring(start, end)
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    handlePromptChange(key, newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      )
    }, 0)
  }

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const key = entry.target.dataset.key
        if (key) {
          setTextareaHeights(prev => ({
            ...prev,
            [key]: entry.target.offsetHeight
          }))
        }
      })
    })

    Object.keys(textareaRefs.current).forEach(key => {
      const textarea = textareaRefs.current[key]
      if (textarea) {
        observer.observe(textarea)
      }
    })

    return () => observer.disconnect()
  }, [Object.keys(prompts).join(',')])

  const getTimestampedFileName = (originalFileName) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0')
    
    const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}_${milliseconds}`
    
    const baseName = originalFileName.replace(/\.json$/, '') || 'prompts'
    return `${baseName}_${timestamp}.json`
  }

  const handleSave = async () => {
    const dataStr = JSON.stringify(prompts, null, 2)
    const timestampedFileName = getTimestampedFileName(fileName)
    
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: timestampedFileName,
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          }],
        })
        const writable = await handle.createWritable()
        await writable.write(dataStr)
        await writable.close()
        setFileName(handle.name)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Save failed:', err)
          alert('Failed to save file')
        }
      }
    } else {
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = timestampedFileName
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleAddKey = () => {
    if (!newKeyName.trim()) {
      alert('Please enter a key name')
      return
    }
    if (prompts[newKeyName]) {
      alert('Key already exists')
      return
    }
    setPrompts(prev => ({
      ...prev,
      [newKeyName]: ''
    }))
    setNewKeyName('')
    setShowAddKey(false)
  }

  const handleDeleteKey = (key) => {
    if (confirm(`Are you sure you want to delete "${key}"?`)) {
      const newPrompts = { ...prompts }
      delete newPrompts[key]
      setPrompts(newPrompts)
    }
  }

  const copyAsJsonSafe = (key, text) => {
    const jsonSafeText = JSON.stringify(text)
    navigator.clipboard.writeText(jsonSafeText.slice(1, -1))
    setCopiedStates(prev => ({ ...prev, [`${key}-json`]: true }))
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [`${key}-json`]: false }))
    }, 1000)
  }

  const copyAsFormatted = (key, text) => {
    navigator.clipboard.writeText(text)
    setCopiedStates(prev => ({ ...prev, [`${key}-formatted`]: true }))
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [`${key}-formatted`]: false }))
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Prompt Writer</h1>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>

          {Object.keys(prompts).length > 0 && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowAddKey(!showAddKey)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Add New Key
              </button>
            </div>
          )}

          {showAddKey && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Key Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKey()}
                  placeholder="Enter key name..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddKey}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddKey(false)
                    setNewKeyName('')
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {Object.keys(prompts).length > 0 && (
          <div className="space-y-6">
            {Object.entries(prompts).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    {key}
                  </label>
                  <button
                    onClick={() => handleDeleteKey(key)}
                    className="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete this key"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Editor</div>
                    
                    <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-100 rounded-lg border border-gray-300">
                      <button
                        onClick={() => insertMarkdown(key, '**', '**')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm font-semibold"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '*', '*')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm italic"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '# ')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
                        title="Heading 1"
                      >
                        H1
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '## ')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '### ')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
                        title="Heading 3"
                      >
                        H3
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '- ')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
                        title="Bullet List"
                      >
                        • List
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '1. ')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
                        title="Numbered List"
                      >
                        1. List
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '[', '](url)')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
                        title="Link"
                      >
                        Link
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '`', '`')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm font-mono"
                        title="Inline Code"
                      >
                        Code
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '```\n', '\n```')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
                        title="Code Block"
                      >
                        Code Block
                      </button>
                      <button
                        onClick={() => insertMarkdown(key, '> ')}
                        className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
                        title="Quote"
                      >
                        Quote
                      </button>
                    </div>

                    <textarea
                      ref={(el) => textareaRefs.current[key] = el}
                      data-key={key}
                      value={value}
                      onChange={(e) => handlePromptChange(key, e.target.value)}
                      className="w-full min-h-[16rem] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
                      placeholder="Enter your prompt here..."
                    />
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
                    
                    <div className="flex gap-1 mb-2 p-2 bg-gray-100 rounded-lg border border-gray-300">
                      <button
                        onClick={() => copyAsJsonSafe(key, value)}
                        className={`px-3 py-1 border border-gray-300 rounded text-sm transition-colors ${
                          copiedStates[`${key}-json`] 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white hover:bg-gray-200'
                        }`}
                        title="Copy as JSON-safe text (with escape characters)"
                      >
                        {copiedStates[`${key}-json`] ? '✓ Copied!' : 'Copy JSON'}
                      </button>
                      <button
                        onClick={() => copyAsFormatted(key, value)}
                        className={`px-3 py-1 border border-gray-300 rounded text-sm transition-colors ${
                          copiedStates[`${key}-formatted`] 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white hover:bg-gray-200'
                        }`}
                        title="Copy as formatted text (with newlines)"
                      >
                        {copiedStates[`${key}-formatted`] ? '✓ Copied!' : 'Copy Formatted'}
                      </button>
                    </div>

                    <div 
                      className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-auto prose prose-sm max-w-none"
                      style={{ height: textareaHeights[key] || '16rem' }}
                    >
                      <ReactMarkdown>{value}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {Object.keys(prompts).length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Upload a JSON file to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

