import { useState } from 'react'
import JsonMdFormatter from './JsonMdFormatter'
import EdnToJsonConverter from './EdnToJsonConverter'

const TABS = [
  { id: 'json-md', label: 'Json Md Formatter' },
  { id: 'edn-json', label: 'EDN to JSON Converter' },
]

function App() {
  const [activeTab, setActiveTab] = useState('json-md')

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Prompt Writer</h1>

          <nav className="flex flex-wrap gap-2 border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors -mb-px border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'json-md' && <JsonMdFormatter />}
        {activeTab === 'edn-json' && <EdnToJsonConverter />}
      </div>
    </div>
  )
}

export default App
