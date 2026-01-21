'use client';

import { useState, useEffect } from 'react';
import { PageHeader, useToast } from '@/components/ui';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedApiKey = localStorage.getItem('claudeApiKey') || '';
    setDarkMode(savedDarkMode);
    setApiKey(savedApiKey);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    addToast(`Dark mode ${newValue ? 'enabled' : 'disabled'}`, 'success');
  };

  const saveApiKey = () => {
    localStorage.setItem('claudeApiKey', apiKey);
    addToast('API key saved successfully', 'success');
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('claudeApiKey');
    addToast('API key cleared', 'success');
  };

  return (
    <div className="p-8 max-w-3xl">
      <PageHeader
        title="Settings"
        subtitle="Configure your ElevateOS preferences"
        backHref="/"
        backLabel="Back to Dashboard"
      />

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
          <h3 className="text-lg font-semibold text-[#11142D] mb-4">Appearance</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#11142D]">Dark Mode</p>
              <p className="text-sm text-[#808191]">Switch between light and dark themes</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-[#47A8DF]' : 'bg-gray-200'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
          <h3 className="text-lg font-semibold text-[#11142D] mb-4">API Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#11142D] mb-2">
                Claude API Key
              </label>
              <p className="text-sm text-[#808191] mb-3">
                Enter your Anthropic API key to enable AI features. Get one at{' '}
                <a 
                  href="https://console.anthropic.com/settings/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#47A8DF] hover:underline"
                >
                  console.anthropic.com
                </a>
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-api03-..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808191] hover:text-[#11142D]"
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showApiKey ? (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={saveApiKey}
                disabled={!apiKey.trim()}
                className="px-4 py-2 bg-[#47A8DF] text-white rounded-lg font-medium hover:bg-[#3B96C9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save API Key
              </button>
              {apiKey && (
                <button
                  onClick={clearApiKey}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            <p className="text-xs text-[#808191]">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
          <h3 className="text-lg font-semibold text-[#11142D] mb-4">About</h3>
          <div className="space-y-2 text-sm text-[#808191]">
            <p><span className="font-medium text-[#11142D]">ElevateOS</span> v1.0.0</p>
            <p>Build, launch, and scale your apps with AI-powered tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
