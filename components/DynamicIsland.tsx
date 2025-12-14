
import React, { useState, useEffect, useRef } from 'react';
import { DynamicIslandMode } from '../types';
import { SPOTIFY_AUTH_URL, getAccessTokenFromUrl, getMockLyrics } from '../services/spotifyService';

const DynamicIsland: React.FC = () => {
  const [mode, setMode] = useState<DynamicIslandMode>(DynamicIslandMode.PILL);
  const [token, setToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [track, setTrack] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  // 1. 获取 Token
  useEffect(() => {
    const _token = getAccessTokenFromUrl();
    if (_token) {
      setToken(_token);
      window.location.hash = ""; 
    }
  }, []);

  // 2. 初始化播放器
  useEffect(() => {
    if (!token) return;

    const initPlayer = () => {
      if (!(window as any).Spotify) return;

      const _player = new (window as any).Spotify.Player({
        name: 'StudySphere Music Island',
        getOAuthToken: (cb: any) => { cb(token); },
        volume: 0.5
      });

      _player.addListener('ready', ({ device_id }: any) => {
        console.log('Spotify Player Ready - Device ID:', device_id);
      });

      _player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        setTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      _player.addListener('initialization_error', ({ message }: any) => console.error('Init Error:', message));
      _player.addListener('authentication_error', ({ message }: any) => {
        console.error('Auth Error:', message);
        setToken(null); // 清除失效 Token
      });

      _player.connect();
      setPlayer(_player);
      playerRef.current = _player;
    };

    if ((window as any).Spotify) {
      initPlayer();
    } else {
      (window as any).onSpotifyWebPlaybackSDKReady = initPlayer;
    }

    return () => {
      playerRef.current?.disconnect();
    };
  }, [token]);

  // 3. 模拟进度更新
  useEffect(() => {
    let interval: any;
    if (!isPaused && duration > 0) {
      interval = setInterval(() => {
        setPosition(prev => (prev + 1000 > duration ? duration : prev + 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, duration]);

  const lyrics = track ? getMockLyrics(track.name) : [];
  const currentLyricIndex = lyrics.findIndex((l, i) => {
    const next = lyrics[i + 1];
    return (position / 1000) >= l.time && (!next || (position / 1000) < next.time);
  }) ?? 0;

  useEffect(() => {
    if (mode === DynamicIslandMode.LYRICS && lyricsContainerRef.current) {
      const activeLine = lyricsContainerRef.current.querySelector('.active-lyric');
      activeLine?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLyricIndex, mode]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  // 登录按钮样式优化
  if (!token) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]">
        <a 
          href={SPOTIFY_AUTH_URL}
          className="bg-black border border-[#1DB954]/50 text-white px-8 py-3 rounded-full text-xs font-black flex items-center gap-3 hover:bg-[#1DB954] transition-all hover:scale-105 shadow-[0_0_20px_rgba(29,185,84,0.2)]"
        >
          <i className="fab fa-spotify text-lg text-[#1DB954] group-hover:text-white"></i>
          连接 SPOTIFY PREMIUM
        </a>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 h-11 bg-black rounded-full border border-white/10 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4">
        <div className="w-2 h-2 bg-[#1DB954] rounded-full animate-pulse"></div>
        <span className="text-[10px] font-bold text-white/60 tracking-tight">已就绪，请在 Spotify 应用中切换至本设备</span>
      </div>
    );
  }

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] perspective-1000">
      <div 
        onClick={() => setMode(prev => 
          prev === DynamicIslandMode.PILL ? DynamicIslandMode.EXPANDED : 
          prev === DynamicIslandMode.EXPANDED ? DynamicIslandMode.LYRICS : DynamicIslandMode.PILL
        )}
        className="bg-black shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)] overflow-hidden cursor-pointer relative border border-white/10 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
        style={{
          width: mode === DynamicIslandMode.PILL ? '240px' : mode === DynamicIslandMode.EXPANDED ? '360px' : '420px',
          height: mode === DynamicIslandMode.PILL ? '44px' : mode === DynamicIslandMode.EXPANDED ? '220px' : '560px',
          borderRadius: mode === DynamicIslandMode.PILL ? '40px' : '48px'
        }}
      >
        {/* PILL MODE */}
        {mode === DynamicIslandMode.PILL && (
          <div className="flex items-center justify-between w-full h-full px-5 text-[10px] animate-in fade-in">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative">
                <img src={track.album.images[0].url} className={`w-7 h-7 rounded-full object-cover transition-transform duration-1000 ${!isPaused ? 'animate-spin-slow' : ''}`} />
                {!isPaused && <div className="absolute inset-0 border border-[#1DB954]/50 rounded-full active-track-animation"></div>}
              </div>
              <span className="font-bold text-white truncate max-w-[110px] tracking-tight">{track.name}</span>
            </div>
            <div className="flex gap-[3px] items-end h-3.5 px-1">
              {[1,2,3,4,5,6].map(i => (
                <div 
                  key={i} 
                  className={`bg-[#1DB954] w-[2px] rounded-full transition-all duration-500 ${!isPaused ? 'animate-bounce' : 'h-[2px]'}`} 
                  style={{ animationDelay: `${i*0.1}s`, height: !isPaused ? '100%' : '2px' }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* EXPANDED MODE */}
        {mode === DynamicIslandMode.EXPANDED && (
          <div className="flex flex-col w-full h-full p-7 animate-in zoom-in-95 duration-500">
            <div className="flex gap-5 items-center">
              <img src={track.album.images[0].url} className="w-28 h-28 rounded-2xl shadow-2xl ring-1 ring-white/10 object-cover" />
              <div className="min-w-0 flex-1">
                <h3 className="text-white text-2xl font-black truncate leading-tight tracking-tighter">{track.name}</h3>
                <p className="text-white/40 text-sm font-bold truncate mb-3">{track.artists[0].name}</p>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#1DB954]/10 rounded-lg border border-[#1DB954]/20">
                   <i className="fab fa-spotify text-[#1DB954] text-xs"></i>
                   <span className="text-[#1DB954] text-[9px] font-black uppercase tracking-widest">Premium Active</span>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between text-[10px] font-mono text-white/30 mb-2">
                <span>{formatTime(position)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] h-full transition-all duration-500 ease-out" 
                  style={{ width: `${(position / duration) * 100}%` }} 
                />
              </div>
              <div className="flex justify-between items-center mt-5 px-8">
                <button onClick={(e) => { e.stopPropagation(); player.previousTrack(); }} className="text-white/40 hover:text-white transition active:scale-75"><i className="fas fa-backward-step text-2xl"></i></button>
                <button 
                  onClick={(e) => { e.stopPropagation(); player.togglePlay(); }} 
                  className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                >
                  <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} text-2xl pl-1`}></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); player.nextTrack(); }} className="text-white/40 hover:text-white transition active:scale-75"><i className="fas fa-forward-step text-2xl"></i></button>
              </div>
            </div>
          </div>
        )}

        {/* LYRICS MODE */}
        {mode === DynamicIslandMode.LYRICS && (
          <div className="flex flex-col w-full h-full p-10 animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5 overflow-hidden">
                <img src={track.album.images[0].url} className="w-14 h-14 rounded-2xl ring-1 ring-white/10 shadow-2xl" />
                <div className="truncate">
                  <h4 className="text-white font-black text-xl truncate tracking-tight mb-1">{track.name}</h4>
                  <p className="text-white/40 text-sm font-bold truncate tracking-wide">{track.artists[0].name}</p>
                </div>
              </div>
              <button onClick={() => setMode(DynamicIslandMode.PILL)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <i className="fas fa-chevron-up text-white/40 text-xs"></i>
              </button>
            </div>

            <div ref={lyricsContainerRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-12 pb-16">
              {lyrics.map((line, idx) => (
                <p 
                  key={idx} 
                  className={`text-3xl font-black transition-all duration-1000 leading-tight tracking-tighter ${
                    idx === currentLyricIndex 
                    ? 'text-white scale-105 opacity-100 active-lyric translate-x-2' 
                    : 'text-white/5 opacity-20 blur-[1px] hover:opacity-40 hover:blur-0'
                  }`}
                >
                  {line.text}
                </p>
              ))}
            </div>

            <div className="mt-4 pt-10 border-t border-white/5 flex flex-col gap-10">
              <div className="flex items-center justify-center gap-16">
                <button onClick={(e) => { e.stopPropagation(); player.previousTrack(); }} className="text-white/30 hover:text-white transition active:scale-75"><i className="fas fa-backward text-3xl"></i></button>
                <button 
                  onClick={(e) => { e.stopPropagation(); player.togglePlay(); }} 
                  className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-90 transition-all"
                >
                  <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} text-4xl pl-1`}></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); player.nextTrack(); }} className="text-white/30 hover:text-white transition active:scale-75"><i className="fas fa-forward text-3xl"></i></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default DynamicIsland;
