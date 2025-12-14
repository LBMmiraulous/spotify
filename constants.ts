
import { Track } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: '深夜学习伴侣',
    artist: 'Lofi Girl',
    cover: 'https://picsum.photos/seed/study1/400/400',
    duration: 240,
    lyrics: [
      { time: 0, text: "正在播放专注 Lofi 音乐..." },
      { time: 10, text: "放轻松，深呼吸" },
      { time: 30, text: "现在是专注的最佳时机" },
      { time: 60, text: "让旋律带走焦虑" },
      { time: 120, text: "你正在变得更好" },
      { time: 180, text: "坚持就是胜利" },
      { time: 230, text: "即将进入下一曲" }
    ]
  },
  {
    id: '2',
    title: '雨声中的思考',
    artist: '自然之音',
    cover: 'https://picsum.photos/seed/rain/400/400',
    duration: 180,
    lyrics: [
      { time: 0, text: "听，窗外的雨声" },
      { time: 20, text: "洗涤心灵的喧嚣" },
      { time: 50, text: "在宁静中寻找灵感" },
      { time: 100, text: "每一滴雨都是一个念头" },
      { time: 150, text: "世界慢了下来" }
    ]
  }
];

export const STUDY_THEMES = [
  "高等数学",
  "计算机科学",
  "文学创作",
  "量子物理",
  "有机化学",
  "世界历史",
  "宏观经济"
];
