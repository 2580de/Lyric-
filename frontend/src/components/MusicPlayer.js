import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MusicPlayer = ({ musicId, onLyricsClick }) => {
  const [music, setMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/music/${musicId}`);
        setMusic(response.data);
      } catch (err) {
        console.error('Failed to fetch music:', err);
      }
    };

    if (musicId) fetchMusic();
  }, [musicId]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (e.target.value / 100) * duration;
    }
  };

  const handleLike = async () => {
    try {
      await axios.put(`http://localhost:5000/api/music/${musicId}/like`, {
        userId: 'current-user-id',
      });
      setLiked(!liked);
    } catch (err) {
      console.error('Failed to like music:', err);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!music) return <div className="text-center p-4">Loading...</div>;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-white/20 shadow-2xl max-w-2xl mx-auto">
      {/* Album Art */}
      <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={music.imageUrl || 'https://via.placeholder.com/300'}
          alt={music.title}
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{music.title}</h2>
        <p className="text-lg text-gray-300">{music.artist}</p>
        {music.album && <p className="text-sm text-gray-400">{music.album}</p>}
      </div>

      {/* Audio Player */}
      <audio
        ref={audioRef}
        src={music.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-300">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          onClick={handleLike}
          className={`p-3 rounded-full transition-all ${
            liked
              ? 'bg-red-500/30 text-red-300'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          ❤️
        </button>

        <button
          onClick={handlePlayPause}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
        >
          {isPlaying ? '⏸ Pause' : '▶️ Play'}
        </button>

        <button
          onClick={() => onLyricsClick(musicId)}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          📝
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-around text-center">
        <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 flex-1 mx-1">
          <p className="text-gray-400 text-sm">Plays</p>
          <p className="text-white font-bold text-lg">{music.plays || 0}</p>
        </div>
        <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 flex-1 mx-1">
          <p className="text-gray-400 text-sm">Likes</p>
          <p className="text-white font-bold text-lg">{music.likedBy?.length || 0}</p>
        </div>
        <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 flex-1 mx-1">
          <p className="text-gray-400 text-sm">Duration</p>
          <p className="text-white font-bold text-lg">{formatTime(duration)}</p>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
