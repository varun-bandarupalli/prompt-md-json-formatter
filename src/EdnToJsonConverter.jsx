import { useState, useRef } from 'react'
import { parseEDNString } from 'edn-data'

const PARSE_OPTIONS = {
  mapAs: 'object',
  keywordAs: 'string',
  setAs: 'array',
  listAs: 'array',
  charAs: 'string',
}

const jsonReplacer = (_, value) => (typeof value === 'bigint' ? value.toString() : value)

function stringifyJson(data, pretty) {
  return JSON.stringify(data, jsonReplacer, pretty ? 2 : undefined)
}

function EdnToJsonConverter() {
  const [ednInput, setEdnInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedAsString, setCopiedAsString] = useState(false)
  const parsedDataRef = useRef(null)
  const fileInputRef = useRef(null)

  const parseEdn = () => {
    if (!ednInput.trim()) {
      setError('Please enter EDN content to convert')
      parsedDataRef.current = null
      return null
    }

    try {
      const parsed = parseEDNString(ednInput, PARSE_OPTIONS)
      parsedDataRef.current = parsed
      setError('')
      return parsed
    } catch (err) {
      parsedDataRef.current = null
      setError(err.message || 'Invalid EDN')
      return null
    }
  }

  const handleConvert = () => {
    const parsed = parseEdn()
    if (parsed !== null) {
      setJsonOutput(stringifyJson(parsed, true))
    } else if (!ednInput.trim()) {
      setJsonOutput('')
    }
  }

  const handlePrettify = () => {
    let parsed = parsedDataRef.current
    if (parsed === null) {
      parsed = parseEdn()
    }
    if (parsed !== null) {
      setJsonOutput(stringifyJson(parsed, true))
    }
  }

  const handleCompact = () => {
    let parsed = parsedDataRef.current
    if (parsed === null) {
      parsed = parseEdn()
    }
    if (parsed !== null) {
      setJsonOutput(stringifyJson(parsed, false))
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setEdnInput(e.target.result)
      setJsonOutput('')
      setError('')
      parsedDataRef.current = null
    }
    reader.readAsText(file)
  }

  const handleCopy = () => {
    if (!jsonOutput) return
    navigator.clipboard.writeText(jsonOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const handleCopyAsString = () => {
    if (!jsonOutput) return
    navigator.clipboard.writeText(JSON.stringify(jsonOutput))
    setCopiedAsString(true)
    setTimeout(() => setCopiedAsString(false), 1000)
  }

  const handleClear = () => {
    setEdnInput('')
    setJsonOutput('')
    setError('')
    parsedDataRef.current = null
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            EDN File
          </label>
          <div className="flex flex-wrap gap-3 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".edn,.txt"
              onChange={handleFileUpload}
              className="flex-1 min-w-[12rem] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            <button
              onClick={handleClear}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleConvert}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Convert
          </button>
          <button
            onClick={handlePrettify}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Prettify
          </button>
          <button
            onClick={handleCompact}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Compact
          </button>
          <button
            onClick={handleCopy}
            disabled={!jsonOutput}
            className={`font-semibold py-2 px-6 rounded-lg transition-colors ${
              jsonOutput
                ? copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy JSON'}
          </button>
          <button
            onClick={handleCopyAsString}
            disabled={!jsonOutput}
            title="Copy as an escaped string literal (with quotes)"
            className={`font-semibold py-2 px-6 rounded-lg transition-colors ${
              jsonOutput
                ? copiedAsString
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {copiedAsString ? '✓ Copied!' : 'Copy as String'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EDN Input
          </label>
          <textarea
            value={ednInput}
            onChange={(e) => {
              setEdnInput(e.target.value)
              setError('')
              parsedDataRef.current = null
            }}
            className="w-full min-h-[24rem] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
            placeholder={'{:key "value" :items [1 2 3]}'}
            spellCheck={false}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            JSON Output
          </label>
          <textarea
            value={jsonOutput}
            readOnly
            className="w-full min-h-[24rem] p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-y"
            placeholder="Converted JSON will appear here..."
            spellCheck={false}
          />
        </div>
      </div>
    </>
  )
}

export default EdnToJsonConverter
