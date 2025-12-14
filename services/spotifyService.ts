
const CLIENT_ID = '405ab8ff294a4b7bace30fbc21fc8e6a';
const REDIRECT_URI = window.location.origin + window.location.pathname;

export const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=streaming%20user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state`;

export const getAccessTokenFromUrl = () => {
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.substring(1));
  return params.get('access_token');
};

export const getMockLyrics = (trackName: string) => {
  return [
    { time: 0, text: `🎵 正在播放: ${trackName}` },
    { time: 5, text: "Spotify Premium 实时同步中" },
    { time: 12, text: "保持呼吸，进入深度学习模式" },
    { time: 25, text: "每一个音符都在激发你的创造力" },
    { time: 40, text: "专注是你最强大的武器" },
    { time: 60, text: "Gemini 正在为你守护计划" },
    { time: 80, text: "学海无涯，音乐相伴" },
    { time: 100, text: "继续坚持，你正在变得更优秀" }
  ];
};
