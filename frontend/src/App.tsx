import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Simplified components for demo
const Layout = () => (
  <div className="flex h-screen bg-gray-100">
    <div className="w-64 bg-white shadow-lg">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6">
          <span className="text-xl font-bold text-gray-900">Prompt Manager</span>
        </div>
        <nav className="mt-6 flex-1 px-4 space-y-4">
          <a href="/prompts" className="nav-link active">
            📝 Prompts
          </a>
          <a href="/categories" className="nav-link">
            📁 Categories  
          </a>
          <a href="/tags" className="nav-link">
            🏷️ Tags
          </a>
        </nav>
        <div className="p-4">
          <button className="btn btn-primary w-full">
            ➕ New Prompt
          </button>
        </div>
      </div>
    </div>
    
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex h-16 items-center px-6">
          <input
            type="text"
            placeholder="Search prompts..."
            className="form-input w-full max-w-md"
          />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <PromptsPage />
      </main>
    </div>
  </div>
);

const PromptsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Prompts</h1>
        <p className="mt-2 text-gray-600">Organize and manage your AI prompts</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-2">Python Function Generator</h3>
        <p className="text-sm text-gray-600 mb-3">Template for generating well-documented Python functions</p>
        <div className="flex items-center justify-between text-sm">
          <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">Template</span>
          <span className="text-gray-500">2 hours ago</span>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-2">Blog Post Outline</h3>
        <p className="text-sm text-gray-600 mb-3">Create comprehensive blog post outlines</p>
        <div className="flex items-center justify-between text-sm">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Writing</span>
          <span className="text-gray-500">1 day ago</span>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-2">Code Review Checklist</h3>
        <p className="text-sm text-gray-600 mb-3">Comprehensive checklist for code reviews</p>
        <div className="flex items-center justify-between text-sm">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Development</span>
          <span className="text-gray-500">3 days ago</span>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-2">Data Analysis Report</h3>
        <p className="text-sm text-gray-600 mb-3">Template for creating data analysis reports</p>
        <div className="flex items-center justify-between text-sm">
          <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">Template</span>
          <span className="text-gray-500">1 week ago</span>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-2">Marketing Campaign Brief</h3>
        <p className="text-sm text-gray-600 mb-3">Create comprehensive marketing campaign briefs</p>
        <div className="flex items-center justify-between text-sm">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Marketing</span>
          <span className="text-gray-500">1 week ago</span>
        </div>
      </div>

      <div className="card" style={{border: '2px dashed #d1d5db', textAlign: 'center'}}>
        <div className="py-8">
          <div className="text-4xl mb-2">➕</div>
          <h3 className="font-semibold text-gray-900 mb-2">Create New Prompt</h3>
          <p className="text-sm text-gray-600">Add a new prompt to your collection</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Backend API Integration</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900">✅ Backend API</h4>
          <p className="text-sm text-green-700">Running on port 3001</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900">📊 SQLite Database</h4>
          <p className="text-sm text-blue-700">5 sample prompts loaded</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-900">🔄 REST Endpoints</h4>
          <p className="text-sm text-purple-700">CRUD operations ready</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-medium text-orange-900">🎨 Frontend UI</h4>
          <p className="text-sm text-orange-700">React + TypeScript</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/prompts" element={<Layout />} />
          <Route path="/categories" element={<Layout />} />
          <Route path="/tags" element={<Layout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
