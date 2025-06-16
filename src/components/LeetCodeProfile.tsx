import React, { useState } from 'react';
import { ExternalLink, Save } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function LeetCodeProfile() {
  const [profileUrl, setProfileUrl] = useLocalStorage<string>('leetcodeProfileUrl', '');
  const [inputValue, setInputValue] = useState(profileUrl);

  const handleSave = () => {
    const trimmedUrl = inputValue.trim();
    setProfileUrl(trimmedUrl);
  };

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200 mt-8">
      <h3 className="font-bold text-lg mb-4 text-slate-900">Your LeetCode Profile</h3>
      <p className="text-sm text-slate-500 mb-4">
        You can save your LeetCode profile URL here for quick access. Please note that this application 
        runs entirely in your browser; direct, automatic syncing of your LeetCode problem completion 
        or other stats is not possible without a backend.
      </p>
      <p className="text-sm text-slate-500 mb-4">
        For full integration with platforms like LeetCode, a <strong>backend server</strong> would be 
        required to handle secure authentication (e.g., OAuth), manage API keys, and bypass browser 
        security restrictions (CORS). Your frontend would then communicate with your own secure backend 
        to fetch and display the data.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Paste your LeetCode profile URL"
          className="flex-1 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save Profile</span>
        </button>
      </div>
      {profileUrl && (
        <div className="mt-4 text-slate-700">
          <p className="text-sm font-medium flex items-center space-x-2">
            <span>Saved Profile:</span>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center space-x-1"
            >
              <span>{profileUrl}</span>
              <ExternalLink size={14} />
            </a>
          </p>
        </div>
      )}
      {!profileUrl && (
        <div className="mt-4">
          <p className="text-sm text-slate-500">No profile URL saved yet.</p>
        </div>
      )}
    </section>
  );
}