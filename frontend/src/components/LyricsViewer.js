import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LyricsViewer = ({ musicId }) => {
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/lyrics/music/${musicId}`);
        setLyrics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Lyrics not found');
        setLoading(false);
      }
    };

    if (musicId) fetchLyrics();
  }, [musicId]);

  const handleLyricClick = (index) => {
    setCurrentLyricIndex(index);
  };

  if (loading) return <div className="text-center p-4">Loading lyrics...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!lyrics) return <div className="text-center p-4">No lyrics available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-6">
      {/* Glass effect header */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 mb-6 border border-white/20 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">{lyrics.title}</h1>
        <p className="text-xl text-gray-200">{lyrics.artist}</p>
        <p className="text-sm text-gray-400 mt-2">🎵 {lyrics.views} views</p>
      </div>

      {/* Lyrics container with glass effect */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main lyrics display */}
        <div className="lg:col-span-3">
          <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/20 min-h-96">
            {lyrics.synced && lyrics.syncedLyrics?.length > 0 ? (
              <div className="space-y-4">
                {lyrics.syncedLyrics.map((line, index) => (
                  <div
                    key={index}
                    onClick={() => handleLyricClick(index)}
                    className={`p-4 rounded-lg transition-all cursor-pointer backdrop-blur-sm ${
                      index === currentLyricIndex
                        ? 'bg-white/20 border-l-4 border-blue-400 text-white text-lg font-semibold'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-gray-500 text-sm">[{Math.floor(line.timestamp / 1000)}s]</span> {line.text}
                  </div>
                ))}
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-gray-200 text-lg leading-relaxed font-light">
                {lyrics.lyrics}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar with translations and info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Language selector */}
          {lyrics.translations && lyrics.translations.length > 0 && (
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">📖 Translations</h3>
              <div className="space-y-2">
                {lyrics.translations.map((trans, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 text-sm transition-all"
                  >
                    {trans.language}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">📊 Info</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Language: <span className="text-white font-semibold">{lyrics.language?.toUpperCase()}</span></p>
              <p>Synced: <span className="text-white font-semibold">{lyrics.synced ? '✅ Yes' : '❌ No'}</span></p>
              <p>Source: <span className="text-white font-semibold">{lyrics.source || 'Unknown'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsViewer;
