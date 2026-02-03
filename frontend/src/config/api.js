const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  MUSIC: {
    LIST: `${API_URL}/music`,
    GET: (id) => `${API_URL}/music/${id}`,
    CREATE: `${API_URL}/music`,
    LIKE: (id) => `${API_URL}/music/${id}/like`,
    DELETE: (id) => `${API_URL}/music/${id}`,
  },
  LYRICS: {
    GET: (musicId) => `${API_URL}/lyrics/music/${musicId}`,
    SYNCED: (id) => `${API_URL}/lyrics/${id}/synced`,
    SEARCH: `${API_URL}/lyrics/search`,
    CREATE: `${API_URL}/lyrics`,
  },
  SPOTIFY: {
    AUTH_URL: `${API_URL}/spotify/auth-url`,
    CALLBACK: `${API_URL}/spotify/callback`,
    GET_USER: (userId) => `${API_URL}/spotify/${userId}`,
    TOP_TRACKS: (userId) => `${API_URL}/spotify/${userId}/top-tracks`,
    PLAYLISTS: (userId) => `${API_URL}/spotify/${userId}/playlists`,
    DISCONNECT: (userId) => `${API_URL}/spotify/${userId}`,
    LINK_TRACK: (userId) => `${API_URL}/spotify/${userId}/link-track`,
  },
};

export default API_ENDPOINTS;
