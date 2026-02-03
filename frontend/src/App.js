import React, { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';
import LyricsViewer from './components/LyricsViewer';
import SpotifyConnect from './components/SpotifyConnect';
import './styles/index.css';

function App() {
  const [currentView, setCurrentView] = useState('music');
  const [selectedMusicId, setSelectedMusicId] = useState(null);
  const [userType, setUserType] = useState('listener');

  const handleLyricsClick = (musicId) => {
    setSelectedMusicId(musicId);
    setCurrentView('lyrics');
  };

  const handleMusicSelect = (musicId) => {
    setSelectedMusicId(musicId);
    setCurrentView('music');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 backdrop-blur-lg bg-black/50 border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎵</span>
            <h1 className="text-2xl font-bold">LYRIC</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('music')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'music'
                  ? 'bg-blue-500/30 border border-blue-400 text-blue-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎧 Music
            </button>
            <button
              onClick={() => setCurrentView('lyrics')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'lyrics'
                  ? 'bg-blue-500/30 border border-blue-400 text-blue-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📝 Lyrics
            </button>
            <button
              onClick={() => setCurrentView('spotify')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'spotify'
                  ? 'bg-green-500/30 border border-green-400 text-green-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎵 Spotify
            </button>

            {/* User Type Selector */}
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
            >
              <option value="listener">👥 Listener</option>
              <option value="artist">🎤 Artist</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'music' && (
          <div>
            <h2 className="text-4xl font-bold mb-8">🎵 Music Player</h2>
            {selectedMusicId ? (
              <MusicPlayer musicId={selectedMusicId} onLyricsClick={handleLyricsClick} />
            ) : (
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-12 border border-white/20 text-center">
                <p className="text-gray-400 text-lg">Select or enter a music ID to get started</p>
                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Enter Music ID..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        handleMusicSelect(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 w-full max-w-md focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'lyrics' && (
          <div>
            <h2 className="text-4xl font-bold mb-8">📝 Lyrics</h2>
            {selectedMusicId ? (
              <LyricsViewer musicId={selectedMusicId} />
            ) : (
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-12 border border-white/20 text-center">
                <p className="text-gray-400 text-lg">Play a song to view its lyrics</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'spotify' && (
          <div>
            <h2 className="text-4xl font-bold mb-8">🎵 Spotify Integration</h2>
            <SpotifyConnect userId="current-user-id" userType={userType} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
