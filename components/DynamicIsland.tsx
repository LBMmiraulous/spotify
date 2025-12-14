
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

  // 1. 处理登录 Token
  useEffect(() => {
    const _token = getAccessTokenFromUrl();
    if (_token) {
      setToken(_token);
      window.location.hash = ""; // 清理 URL
    }
  }, []);

  // 2. 初始化 Spotify SDK Player
  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const _player = new (window as any).Spotify.Player({
        name: 'StudySphere Music Island',
        getOAuthToken: (cb: any) => { cb(token); },
        volume: 0.5
      });

      _player.addListener('ready', ({ device_id }: any) => {
        console.log('Ready with Device ID', device_id);
      });

      _player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        setTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      _player.connect();
      setPlayer(_player);
    };

    return () => {
      player?.disconnect();
    };
  }, [token]);

  // 3. 进度条自增（模拟）
  useEffect(() => {
    let interval: any;
    if (!isPaused) {
      interval = setInterval(() => {
        setPosition(prev => prev + 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

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

  // 渲染逻辑
  if (!token) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]">
        <a 
          href={SPOTIFY_AUTH_URL}
          className="bg-black border border-[#1DB954]/30 text-white px-6 py-2 rounded-full text-xs font-black flex items-center gap-2 hover:bg-[#1DB954] transition-all hover:scale-105"
        >
          <i className="fab fa-spotify text-[#1DB954]"></i>
          登录以激活 Spotify Premium 灵动岛
        </a>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-48 h-10 bg-black rounded-full border border-white/10 flex items-center justify-center animate-pulse">
        <span className="text-[10px] font-bold text-white/40">请在 Spotify APP 中选择本设备播放</span>
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
        className="bg-black shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer relative border border-white/10 transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1)"
        style={{
          width: mode === DynamicIslandMode.PILL ? '220px' : mode === DynamicIslandMode.EXPANDED ? '340px' : '400px',
          height: mode === DynamicIslandMode.PILL ? '40px' : mode === DynamicIslandMode.EXPANDED ? '200px' : '520px',
          borderRadius: mode === DynamicIslandMode.PILL ? '40px' : '44px'
        }}
      >
        {/* PILL MODE */}
        {mode === DynamicIslandMode.PILL && (
          <div className="flex items-center justify-between w-full h-full px-4 text-[10px] animate-in fade-in">
            <div className="flex items-center gap-2 overflow-hidden">
              <img src={track.album.images[0].url} className={`w-6 h-6 rounded-full object-cover ${!isPaused ? 'animate-spin-slow' : ''}`} />
              <span className="font-bold text-white truncate max-w-[100px]">{track.name}</span>
            </div>
            <div className="flex gap-[2px] items-end h-3">
              {[1,2,3,4,5].map(i => (
                <div 
                  key={i} 
                  className={`bg-[#1DB954] w-[2px] rounded-full transition-all ${!isPaused ? 'animate-bounce' : 'h-[2px]'}`} 
                  style={{ animationDelay: `${i*0.1}s`, height: !isPaused ? '100%' : '2px' }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* EXPANDED MODE */}
        {mode === DynamicIslandMode.EXPANDED && (
          <div className="flex flex-col w-full h-full p-6 animate-in zoom-in-95 duration-300">
            <div className="flex gap-4 items-center">
              <img src={track.album.images[0].url} className="w-24 h-24 rounded-2xl shadow-2xl ring-1 ring-white/10" />
              <div className="min-w-0 flex-1">
                <h3 className="text-white text-xl font-black truncate leading-tight">{track.name}</h3>
                <p className="text-white/40 text-sm font-bold truncate mb-2">{track.artists[0].name}</p>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#1DB954]/10 rounded border border-[#1DB954]/20">
                   <i className="fab fa-spotify text-[#1DB954] text-[10px]"></i>
                   <span className="text-[#1DB954] text-[8px] font-black uppercase">Premium Playing</span>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between text-[10px] font-mono text-white/20 mb-1.5">
                <span>{formatTime(position)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#1DB954] h-full transition-all duration-300" 
                  style={{ width: `${(position / duration) * 100}%` }} 
                />
              </div>
              <div className="flex justify-between items-center mt-4 px-6">
                <button onClick={(e) => { e.stopPropagation(); player.previousTrack(); }} className="text-white/40 hover:text-white transition active:scale-90"><i className="fas fa-backward-step text-xl"></i></button>
                <button 
                  onClick={(e) => { e.stopPropagation(); player.togglePlay(); }} 
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-90 transition shadow-2xl"
                >
                  <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} text-xl`}></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); player.nextTrack(); }} className="text-white/40 hover:text-white transition active:scale-90"><i className="fas fa-forward-step text-xl"></i></button>
              </div>
            </div>
          </div>
        )}

        {/* LYRICS MODE */}
        {mode === DynamicIslandMode.LYRICS && (
          <div className="flex flex-col w-full h-full p-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4 overflow-hidden">
                <img src={track.album.images[0].url} className="w-12 h-12 rounded-xl ring-1 ring-white/10" />
                <div className="truncate">
                  <h4 className="text-white font-black text-base truncate leading-none mb-1">{track.name}</h4>
                  <p className="text-white/40 text-xs truncate">{track.artists[0].name}</p>
                </div>
              </div>
              <button onClick={() => setMode(DynamicIslandMode.PILL)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <i className="fas fa-chevron-up text-white/40 text-[10px]"></i>
              </button>
            </div>

            <div ref={lyricsContainerRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-10 pb-10">
              {lyrics.map((line, idx) => (
                <p 
                  key={idx} 
                  className={`text-2xl font-black transition-all duration-700 leading-tight ${
                    idx === currentLyricIndex 
                    ? 'text-white scale-105 opacity-100 active-lyric' 
                    : 'text-white/5 opacity-20 hover:text-white/30'
                  }`}
                >
                  {line.text}
                </p>
              ))}
            </div>

            <div className="mt-4 pt-6 border-t border-white/5 flex flex-col gap-8">
              <div className="flex items-center justify-center gap-14">
                <button onClick={(e) => { e.stopPropagation(); player.previousTrack(); }} className="text-white/30 hover:text-white transition"><i className="fas fa-backward text-2xl"></i></button>
                <button 
                  onClick={(e) => { e.stopPropagation(); player.togglePlay(); }} 
                  className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} text-3xl`}></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); player.nextTrack(); }} className="text-white/30 hover:text-white transition"><i className="fas fa-forward text-2xl"></i></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default DynamicIsland;
