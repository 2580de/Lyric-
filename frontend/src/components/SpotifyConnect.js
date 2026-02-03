import React, { useState } from 'react';
import axios from 'axios';

const SpotifyConnect = ({ userId, userType = 'listener' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [spotifyInfo, setSpotifyInfo] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/spotify/auth-url');
      window.location.href = response.data.authUrl;
    } catch (err) {
      console.error('Failed to get auth URL:', err);
    }
  };

  const handleCallback = async (code) => {
    try {
      const response = await axios.post('http://localhost:5000/api/spotify/callback', {
        code,
        userId,
        userType,
      });
      setIsConnected(true);
      setSpotifyInfo(response.data.integration);
    } catch (err) {
      console.error('Failed to connect to Spotify:', err);
    }
  };

  const fetchTopTracks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/spotify/${userId}/top-tracks`);
      setTopTracks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch top tracks:', err);
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/spotify/${userId}`);
      setIsConnected(false);
      setSpotifyInfo(null);
      setTopTracks([]);
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-3xl p-8 border border-green-400/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          🎵 Spotify Connect
        </h2>
        <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-300 text-sm font-semibold">
          {userType === 'artist' ? '🎤 Artist' : '👥 Listener'}
        </span>
      </div>

      {!isConnected ? (
        <div className="text-center">
          <p className="text-gray-200 mb-6">Connect your Spotify account to share your music and playlists</p>
          <button
            onClick={handleConnect}
            className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 text-black font-bold rounded-full hover:shadow-lg transition-all text-lg"
          >
            🎧 Connect with Spotify
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Info */}
          {spotifyInfo && (
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                {spotifyInfo.profileImage && (
                  <img
                    src={spotifyInfo.profileImage}
                    alt={spotifyInfo.displayName}
                    className="w-16 h-16 rounded-full border-2 border-green-400"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{spotifyInfo.displayName}</h3>
                  <p className="text-gray-300">@{spotifyInfo.spotifyUsername}</p>
                  <p className="text-sm text-green-400 mt-1">✅ Connected</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm">Followers</p>
                  <p className="text-white font-bold text-lg">{spotifyInfo.followers?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Following</p>
                  <p className="text-white font-bold text-lg">{spotifyInfo.following?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Popularity</p>
                  <p className="text-white font-bold text-lg">{spotifyInfo.popularity || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Top Tracks Section */}
          <div>
            <button
              onClick={fetchTopTracks}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-500/20 border border-green-400/50 text-green-300 rounded-xl hover:bg-green-500/30 font-semibold transition-all disabled:opacity-50"
            >
              {loading ? '⏳ Loading...' : '📈 Load Your Top Tracks'}
            </button>

            {topTracks.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-semibold text-white mb-4">Your Top Tracks</h3>
                {topTracks.slice(0, 10).map((track, idx) => (
                  <div
                    key={track.id}
                    className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {track.album?.images?.[0]?.url && (
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          className="w-12 h-12 rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-semibold">{idx + 1}. {track.name}</p>
                        <p className="text-gray-400 text-sm">
                          {track.artists.map(a => a.name).join(', ')}
                        </p>
                      </div>
                      <span className="text-gray-500 text-sm">{Math.round(track.duration_ms / 60000)}m</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disconnect Button */}
          <button
            onClick={handleDisconnect}
            className="w-full px-6 py-3 bg-red-500/20 border border-red-400/50 text-red-300 rounded-xl hover:bg-red-500/30 font-semibold transition-all"
          >
            🔌 Disconnect Spotify
          </button>
        </div>
      )}
    </div>
  );
};

export default SpotifyConnect;
