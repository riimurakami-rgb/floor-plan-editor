import { useState, useRef, useCallback, useEffect } from "react";

const PX=7;

/* ═══ FLOOR DATA with dimension lines ═══ */
const FLOORS={
"1F":{name:"1階",sub:"店舗 92.052㎡",bw:139,bh:80,
  dims:{top:[{x1:0,x2:36,l:"3600"},{x1:36,x2:115,l:"7900"},{x1:115,x2:120,l:"500"},{x1:0,x2:120,l:"12000",row:2}],
    bottom:[{x1:0,x2:115,l:"11500"},{x1:115,x2:139,l:"2400"},{x1:0,x2:139,l:"13900",row:2}],
    left:[{y1:0,y2:70,l:"7000"},{y1:0,y2:80,l:"8000",col:2},{y1:70,y2:80,l:"1000"}],
    right:[{y1:0,y2:5,l:"500"},{y1:0,y2:10,l:"1000"},{y1:0,y2:15,l:"1500"},{y1:15,y2:35,l:"2000"},{y1:0,y2:80,l:"8000",col:2},{y1:50,y2:72,l:"2190"},{y1:72,y2:80,l:"1000"},{y1:60,y2:72,l:"1310"}]},
  walls:[{x:0,y:0,w:139,h:1.5,t:"o"},{x:0,y:78.5,w:139,h:1.5,t:"o"},{x:0,y:0,w:1.5,h:80,t:"o"},{x:115,y:0,w:24,h:1.5,t:"o"},{x:137.5,y:0,w:1.5,h:80,t:"o"},{x:115,y:50,w:24,h:1,t:"i"},{x:115,y:50,w:1,h:30,t:"i"},{x:60,y:68,w:25,h:1,t:"i"},{x:60,y:68,w:1,h:12,t:"i"},{x:84,y:68,w:1,h:12,t:"i"},{x:84,y:60,w:20,h:1,t:"i"},{x:84,y:60,w:1,h:20,t:"i"},{x:104,y:65,w:12,h:1,t:"i"},{x:104,y:65,w:1,h:15,t:"i"}],
  rooms:[{x:55,y:38,label:"店舗",large:1},{x:125,y:55,label:"カウンター収納"},{x:92,y:64,label:"洗面"},{x:110,y:72,label:"ポンプ室"},{x:66,y:75,label:"PS"},{x:75,y:75,label:"トイレ"}],
  builtins:[{type:"toilet",x:78,y:72,w:3.5,h:5},{type:"sink",x:90,y:62,w:4,h:3}],columns:[{x:2,y:14,s:5},{x:12,y:14,s:5},{x:117,y:14,s:5}]},
"2F":{name:"2階",sub:"LDK+洋室 102.560㎡",bw:155,bh:89,
  dims:{top:[{x1:0,x2:36,l:"3600"},{x1:36,x2:115,l:"7900"},{x1:115,x2:133,l:"1800"},{x1:0,x2:139,l:"13300",row:2},{x1:139,x2:145,l:"600"}],
    bottom:[{x1:0,x2:8,l:"600"},{x1:8,x2:38,l:"3000"},{x1:38,x2:118,l:"7900"},{x1:118,x2:142,l:"2400"},{x1:0,x2:142,l:"13900",row:2}],
    left:[{y1:0,y2:9,l:"900"},{y1:9,y2:79,l:"7000"},{y1:0,y2:89,l:"8900",col:2},{y1:79,y2:89,l:"1000"}],
    right:[{y1:0,y2:23,l:"2290"},{y1:0,y2:42,l:"4150",col:2},{y1:42,y2:60,l:"1860"},{y1:60,y2:64,l:"350"},{y1:0,y2:89,l:"8000",col:3},{y1:64,y2:82,l:"2500"},{y1:82,y2:89,l:"1000"}]},
  walls:[{x:0,y:0,w:139,h:1.5,t:"o"},{x:120,y:0,w:35,h:1.5,t:"o"},{x:0,y:87.5,w:155,h:1.5,t:"o"},{x:0,y:0,w:1.5,h:89,t:"o"},{x:153.5,y:0,w:1.5,h:89,t:"o"},{x:40,y:1.5,w:1,h:35,t:"i"},{x:10,y:36,w:31,h:1,t:"i"},{x:40,y:24,w:25,h:1,t:"i"},{x:10,y:36,w:1,h:52,t:"i"},{x:10,y:55,w:32,h:1,t:"i"},{x:41,y:65,w:15,h:1,t:"i"},{x:41,y:65,w:1,h:23,t:"i"},{x:55,y:65,w:1,h:23,t:"i"},{x:56,y:65,w:14,h:1,t:"i"},{x:69,y:65,w:1,h:23,t:"i"},{x:70,y:65,w:13,h:1,t:"i"},{x:82,y:65,w:1,h:23,t:"i"},{x:83,y:65,w:35,h:1,t:"i"},{x:83,y:65,w:1,h:23,t:"i"},{x:118,y:48,w:37,h:1,t:"i"},{x:118,y:48,w:1,h:20,t:"i"},{x:118,y:38,w:37,h:1,t:"i"},{x:118,y:1.5,w:1,h:37,t:"i"},{x:136,y:0,w:1,h:39,t:"i"},{x:30,y:76,w:12,h:1,t:"i"},{x:30,y:76,w:1,h:12,t:"i"},{x:41,y:76,w:1,h:12,t:"i"}],
  rooms:[{x:25,y:20,label:"洋室1",sub:"約7.5畳"},{x:75,y:30,label:"LDK",sub:"約21.6畳",large:1},{x:25,y:60,label:"洋室2",sub:"約6.3畳"},{x:100,y:75,label:"洋室3",sub:"約3.7畳"},{x:48,y:75,label:"洗面室"},{x:62,y:75,label:"脱衣室"},{x:76,y:75,label:"UB"},{x:135,y:55,label:"玄関"},{x:128,y:42,label:"畳小上り"},{x:35,y:82,label:"トイレ"}],
  builtins:[{type:"stove",x:42,y:25,w:8,h:5}],columns:[]},
"3F":{name:"3階",sub:"DK+洋室6室 102.767㎡",bw:155,bh:89,
  dims:{top:[{x1:0,x2:36,l:"3600"},{x1:36,x2:115,l:"7900"},{x1:115,x2:133,l:"1800"},{x1:0,x2:139,l:"13300",row:2},{x1:139,x2:145,l:"600"}],
    bottom:[{x1:0,x2:8,l:"600"},{x1:8,x2:38,l:"3000"},{x1:38,x2:118,l:"7900"},{x1:118,x2:142,l:"2400"},{x1:0,x2:142,l:"13900",row:2}],
    left:[{y1:0,y2:9,l:"900"},{y1:9,y2:79,l:"7000"},{y1:0,y2:89,l:"8900",col:2},{y1:79,y2:89,l:"1000"}],
    right:[{y1:0,y2:23,l:"2290"},{y1:42,y2:60,l:"1860"},{y1:60,y2:64,l:"350"},{y1:0,y2:89,l:"8000",col:3},{y1:64,y2:82,l:"2500"},{y1:82,y2:89,l:"1000"}]},
  walls:[{x:0,y:0,w:139,h:1.5,t:"o"},{x:120,y:0,w:35,h:1.5,t:"o"},{x:0,y:87.5,w:155,h:1.5,t:"o"},{x:0,y:0,w:1.5,h:89,t:"o"},{x:153.5,y:0,w:1.5,h:89,t:"o"},{x:35,y:1.5,w:1,h:30,t:"i"},{x:35,y:25,w:25,h:1,t:"i"},{x:60,y:1.5,w:1,h:25,t:"i"},{x:35,y:36,w:26,h:1,t:"i"},{x:60,y:1.5,w:25,h:1,t:"i"},{x:84,y:1.5,w:1,h:25,t:"i"},{x:60,y:26,w:25,h:1,t:"i"},{x:84,y:36,w:1,h:12,t:"i"},{x:84,y:36,w:35,h:1,t:"i"},{x:118,y:1.5,w:1,h:35,t:"i"},{x:136,y:0,w:1,h:37,t:"i"},{x:10,y:36,w:1,h:52,t:"i"},{x:10,y:53,w:26,h:1,t:"i"},{x:10,y:73,w:26,h:1,t:"i"},{x:36,y:65,w:15,h:1,t:"i"},{x:36,y:65,w:1,h:23,t:"i"},{x:50,y:65,w:1,h:23,t:"i"},{x:51,y:65,w:13,h:1,t:"i"},{x:63,y:65,w:1,h:23,t:"i"},{x:63,y:72,w:12,h:1,t:"i"},{x:63,y:72,w:1,h:16,t:"i"},{x:74,y:72,w:1,h:16,t:"i"},{x:83,y:65,w:35,h:1,t:"i"},{x:83,y:65,w:1,h:23,t:"i"},{x:118,y:48,w:37,h:1,t:"i"},{x:118,y:48,w:1,h:20,t:"i"}],
  rooms:[{x:20,y:20,label:"DK",sub:"約6.5畳"},{x:48,y:25,label:"洋室1",sub:"約4.5畳"},{x:72,y:15,label:"洋室2",sub:"約6.8畳"},{x:105,y:22,label:"洋室3",sub:"約5.5畳"},{x:22,y:46,label:"洋室5",sub:"約6.5畳"},{x:20,y:80,label:"洋室6",sub:"約3.6畳"},{x:105,y:75,label:"洋室4",sub:"約4.8畳"},{x:43,y:75,label:"浴室"},{x:57,y:75,label:"洗面室"},{x:68,y:80,label:"トイレ"},{x:135,y:55,label:"玄関"}],
  builtins:[{type:"stove",x:37,y:26,w:8,h:5}],columns:[]},
"4F":{name:"4階",sub:"LD+K+洋室 75.125㎡",bw:155,bh:89,
  dims:{top:[{x1:0,x2:36,l:"3600"},{x1:36,x2:120,l:"9700"},{x1:0,x2:139,l:"13300",row:2},{x1:139,x2:145,l:"600"}],
    bottom:[{x1:0,x2:8,l:"600"},{x1:8,x2:38,l:"3000"},{x1:38,x2:118,l:"7900"},{x1:118,x2:142,l:"2400"},{x1:0,x2:142,l:"13900",row:2}],
    left:[{y1:0,y2:9,l:"900"},{y1:9,y2:79,l:"7000"},{y1:0,y2:89,l:"8900",col:2},{y1:79,y2:89,l:"1000"}],
    right:[{y1:0,y2:23,l:"2290"},{y1:0,y2:42,l:"5050",col:2},{y1:42,y2:60,l:"1860"},{y1:60,y2:64,l:"350"},{y1:0,y2:89,l:"8000",col:3},{y1:64,y2:82,l:"2500"},{y1:82,y2:89,l:"1000"}]},
  walls:[{x:0,y:0,w:139,h:1.5,t:"o"},{x:120,y:0,w:35,h:1.5,t:"o"},{x:0,y:87.5,w:155,h:1.5,t:"o"},{x:0,y:0,w:1.5,h:89,t:"o"},{x:153.5,y:0,w:1.5,h:89,t:"o"},{x:40,y:1.5,w:1,h:50,t:"i"},{x:40,y:40,w:30,h:1,t:"i"},{x:118,y:1.5,w:1,h:30,t:"i"},{x:118,y:36,w:37,h:1,t:"i"},{x:136,y:0,w:1,h:30,t:"i"},{x:118,y:48,w:37,h:1,t:"i"},{x:118,y:48,w:1,h:20,t:"i"},{x:40,y:65,w:15,h:1,t:"i"},{x:40,y:65,w:1,h:23,t:"i"},{x:54,y:65,w:1,h:23,t:"i"},{x:55,y:65,w:12,h:1,t:"i"},{x:66,y:65,w:1,h:23,t:"i"},{x:35,y:70,w:6,h:1,t:"i"},{x:35,y:70,w:1,h:18,t:"i"},{x:75,y:65,w:44,h:1,t:"i"},{x:75,y:65,w:1,h:23,t:"i"},{x:30,y:76,w:6,h:1,t:"i"},{x:30,y:76,w:1,h:12,t:"i"}],
  rooms:[{x:20,y:30,label:"LD",sub:"約11.7畳",large:1},{x:55,y:48,label:"K",sub:"約3.2畳"},{x:130,y:22,label:"洋室1",sub:"約9.1畳"},{x:100,y:75,label:"洋室2",sub:"約4.9畳"},{x:47,y:75,label:"洗面室"},{x:60,y:75,label:"UB"},{x:38,y:77,label:"脱衣室"},{x:33,y:82,label:"トイレ"},{x:135,y:55,label:"玄関"}],
  builtins:[{type:"stove",x:42,y:41,w:8,h:5}],columns:[]},
"M1F":{name:"民宿1F",sub:"家具配置図 1:60",bw:139,bh:80,
  dims:{top:[{x1:0,x2:24,l:"2400"},{x1:24,x2:139,l:"11500"},{x1:0,x2:139,l:"13900",row:2}],
    bottom:[{x1:0,x2:5,l:"500"},{x1:5,x2:84,l:"7900"},{x1:84,x2:120,l:"3600"},{x1:5,x2:125,l:"12000",row:2}],
    left:[{y1:0,y2:10,l:"1000"},{y1:10,y2:23,l:"1310"},{y1:23,y2:45,l:"2190"},{y1:45,y2:60,l:"3000"},{y1:60,y2:70,l:"1000"},{y1:70,y2:75,l:"500"},{y1:0,y2:80,l:"8000",col:2}],
    right:[{y1:0,y2:10,l:"1000"},{y1:0,y2:80,l:"8000",col:2},{y1:10,y2:80,l:"7000"}]},
  walls:[{x:0,y:0,w:139,h:1.5,t:"o"},{x:0,y:78.5,w:139,h:1.5,t:"o"},{x:0,y:0,w:1.5,h:80,t:"o"},{x:137.5,y:0,w:1.5,h:80,t:"o"},{x:1.5,y:12,w:40,h:1,t:"i"},{x:41,y:0,w:1,h:26,t:"i"},{x:1.5,y:25,w:20,h:1,t:"i"},{x:1.5,y:42,w:25,h:1,t:"i"},{x:25,y:42,w:1,h:25,t:"i"},{x:1.5,y:55,w:25,h:1,t:"i"},{x:1.5,y:65,w:25,h:1,t:"i"},{x:42,y:25,w:50,h:1,t:"i"},{x:42,y:25,w:1,h:20,t:"i"},{x:85,y:42,w:1,h:37,t:"i"},{x:85,y:55,w:54,h:1,t:"i"},{x:42,y:42,w:44,h:1,t:"i"},{x:26,y:65,w:30,h:1,t:"i"},{x:92,y:0,w:1,h:20,t:"i"},{x:92,y:0,w:47,h:1,t:"i"}],
  rooms:[{x:25,y:7,label:"三人間A"},{x:68,y:35,label:"三人間B"},{x:110,y:68,label:"三人間C"},{x:14,y:50,label:"公卫"},{x:14,y:72,label:"員工間"},{x:55,y:72,label:"接待大厅",large:1}],
  builtins:[],columns:[]},
};

/* ═══ ICON RENDERER ═══ */
const I=({t,w=42,h=42})=>{const v="0 0 40 40";const s={display:'block'};
const ic={
bed_s:<svg width={w} height={h} viewBox={v} style={s}><rect x="2" y="4" width="36" height="32" rx="2" fill="#3d3560" stroke="#7b68ee" strokeWidth="1.2"/><rect x="4" y="6" width="32" height="8" rx="4" fill="#4a4080" stroke="#7b68ee" strokeWidth=".8"/><rect x="6" y="18" width="28" height="14" rx="1" fill="none" stroke="#7b68ee" strokeWidth=".6" strokeDasharray="2,1"/></svg>,
bed_d:<svg width={w} height={h} viewBox={v} style={s}><rect x="1" y="4" width="38" height="32" rx="2" fill="#3d3560" stroke="#7b68ee" strokeWidth="1.2"/><rect x="3" y="6" width="16" height="8" rx="4" fill="#4a4080" stroke="#7b68ee" strokeWidth=".8"/><rect x="21" y="6" width="16" height="8" rx="4" fill="#4a4080" stroke="#7b68ee" strokeWidth=".8"/><rect x="4" y="18" width="32" height="14" rx="1" fill="none" stroke="#7b68ee" strokeWidth=".5"/></svg>,
bed_sd:<svg width={w} height={h} viewBox={v} style={s}><rect x="2" y="4" width="36" height="32" rx="2" fill="#3d3560" stroke="#9b88ff" strokeWidth="1"/><rect x="4" y="6" width="32" height="8" rx="4" fill="#4a4080" stroke="#9b88ff" strokeWidth=".7"/><rect x="5" y="18" width="30" height="14" rx="1" fill="none" stroke="#9b88ff" strokeWidth=".5"/></svg>,
bunk:<svg width={w} height={h} viewBox={v} style={s}><rect x="4" y="2" width="32" height="16" rx="1" fill="#3d3560" stroke="#7b68ee" strokeWidth="1"/><rect x="4" y="22" width="32" height="16" rx="1" fill="#3d3560" stroke="#7b68ee" strokeWidth="1"/><line x1="6" y1="18" x2="6" y2="22" stroke="#7b68ee" strokeWidth="1.5"/><line x1="34" y1="18" x2="34" y2="22" stroke="#7b68ee" strokeWidth="1.5"/></svg>,
futon:<svg width={w} height={h} viewBox={v} style={s}><rect x="3" y="3" width="34" height="34" rx="3" fill="#4a4030" stroke="#b8a060" strokeWidth="1"/><line x1="3" y1="12" x2="37" y2="12" stroke="#b8a060" strokeWidth=".6"/><rect x="6" y="5" width="28" height="6" rx="2" fill="#5a5040" stroke="#b8a060" strokeWidth=".6"/></svg>,
toilet:<svg width={w} height={h} viewBox={v} style={s}><rect x="10" y="2" width="20" height="10" rx="2" fill="#2a4a5a" stroke="#5aa8c8" strokeWidth="1"/><ellipse cx="20" cy="26" rx="12" ry="12" fill="#2a4a5a" stroke="#5aa8c8" strokeWidth="1.2"/><ellipse cx="20" cy="24" rx="7" ry="8" fill="none" stroke="#5aa8c8" strokeWidth=".8"/></svg>,
sink:<svg width={w} height={h} viewBox={v} style={s}><rect x="4" y="8" width="32" height="24" rx="4" fill="#2a4a5a" stroke="#5aa8c8" strokeWidth="1.2"/><ellipse cx="20" cy="20" rx="10" ry="8" fill="none" stroke="#5aa8c8" strokeWidth="1"/><circle cx="20" cy="20" r="2" fill="#5aa8c8"/><line x1="20" y1="8" x2="20" y2="3" stroke="#5aa8c8" strokeWidth="1.5"/></svg>,
bath:<svg width={w} height={h} viewBox={v} style={s}><rect x="3" y="5" width="34" height="30" rx="5" fill="#2a4a5a" stroke="#5aa8c8" strokeWidth="1.2"/><rect x="6" y="8" width="28" height="24" rx="3" fill="none" stroke="#5aa8c8" strokeWidth=".8"/><circle cx="32" cy="10" r="2" fill="#5aa8c8"/></svg>,
shower:<svg width={w} height={h} viewBox={v} style={s}><rect x="4" y="4" width="32" height="32" rx="3" fill="#2a4a5a" stroke="#5aa8c8" strokeWidth="1"/><circle cx="20" cy="14" r="6" fill="none" stroke="#5aa8c8" strokeWidth=".8"/><line x1="16" y1="26" x2="24" y2="26" stroke="#5aa8c8" strokeWidth="1"/><line x1="20" y1="20" x2="20" y2="26" stroke="#5aa8c8" strokeWidth=".8"/></svg>,
unit_bath:<svg width={w} height={h} viewBox={v} style={s}><rect x="2" y="2" width="36" height="36" rx="2" fill="#2a4a5a" stroke="#5aa8c8" strokeWidth="1"/><rect x="4" y="4" width="20" height="18" rx="3" fill="none" stroke="#5aa8c8" strokeWidth=".8"/><rect x="26" y="4" width="10" height="10" rx="1" fill="none" stroke="#5aa8c8" strokeWidth=".6"/><ellipse cx="31" cy="9" rx="3" ry="3" fill="none" stroke="#5aa8c8" strokeWidth=".5"/><ellipse cx="14" cy="30" rx="5" ry="5" fill="none" stroke="#5aa8c8" strokeWidth=".7"/><circle cx="31" cy="28" r="2" fill="#5aa8c8"/></svg>,
kitchen:<svg width={w} height={h} viewBox={v} style={s}><rect x="2" y="8" width="36" height="24" rx="2" fill="#4a3020" stroke="#c87040" strokeWidth="1.2"/><circle cx="11" cy="16" r="4" fill="none" stroke="#c87040" strokeWidth="1"/><circle cx="22" cy="16" r="4" fill="none" stroke="#c87040" strokeWidth="1"/><rect x="28" y="12" width="8" height="10" rx="2" fill="none" stroke="#c87040" strokeWidth=".8"/></svg>,
fridge:<svg width={w} height={h} viewBox={v} style={s}><rect x="8" y="2" width="24" height="36" rx="2" fill="#2a3a4a" stroke="#6a8a9a" strokeWidth="1.2"/><line x1="8" y1="16" x2="32" y2="16" stroke="#6a8a9a" strokeWidth=".8"/><rect x="28" y="8" width="2" height="5" rx="1" fill="#6a8a9a"/><rect x="28" y="20" width="2" height="5" rx="1" fill="#6a8a9a"/></svg>,
washer:<svg width={w} height={h} viewBox={v} style={s}><rect x="6" y="3" width="28" height="34" rx="3" fill="#2a3a4a" stroke="#6a8a9a" strokeWidth="1.2"/><circle cx="20" cy="23" r="9" fill="none" stroke="#6a8a9a" strokeWidth="1"/><circle cx="14" cy="9" r="2" fill="#6a8a9a"/></svg>,
ac:<svg width={w} height={h} viewBox={v} style={s}><rect x="3" y="10" width="34" height="12" rx="3" fill="#2a3a5a" stroke="#6a9aba" strokeWidth="1"/><line x1="8" y1="22" x2="8" y2="30" stroke="#6a9aba" strokeWidth=".5" strokeDasharray="1,1"/><line x1="20" y1="22" x2="20" y2="30" stroke="#6a9aba" strokeWidth=".5" strokeDasharray="1,1"/><line x1="32" y1="22" x2="32" y2="30" stroke="#6a9aba" strokeWidth=".5" strokeDasharray="1,1"/></svg>,
tv:<svg width={w} height={h} viewBox={v} style={s}><rect x="4" y="8" width="32" height="20" rx="1" fill="#1a2030" stroke="#6080a0" strokeWidth="1.2"/><rect x="6" y="10" width="28" height="16" rx="0" fill="none" stroke="#6080a0" strokeWidth=".5"/><line x1="15" y1="28" x2="15" y2="33" stroke="#6080a0" strokeWidth="1"/><line x1="25" y1="28" x2="25" y2="33" stroke="#6080a0" strokeWidth="1"/><line x1="12" y1="33" x2="28" y2="33" stroke="#6080a0" strokeWidth="1"/></svg>,
desk:<svg width={w} height={h} viewBox={v} style={s}><rect x="3" y="8" width="34" height="18" rx="1" fill="#4a4a30" stroke="#a0a060" strokeWidth="1.2"/><line x1="6" y1="26" x2="6" y2="36" stroke="#a0a060" strokeWidth="2"/><line x1="34" y1="26" x2="34" y2="36" stroke="#a0a060" strokeWidth="2"/></svg>,
chair:<svg width={w} height={h} viewBox={v} style={s}><rect x="10" y="18" width="20" height="18" rx="2" fill="#4a4a30" stroke="#a0a060" strokeWidth="1"/><rect x="10" y="4" width="20" height="14" rx="2" fill="none" stroke="#a0a060" strokeWidth=".8"/></svg>,
sofa:<svg width={w} height={h} viewBox={v} style={s}><rect x="2" y="10" width="36" height="22" rx="4" fill="#5a3a4a" stroke="#c080a0" strokeWidth="1.2"/><rect x="5" y="6" width="30" height="8" rx="3" fill="#5a3a4a" stroke="#c080a0" strokeWidth=".8"/><rect x="2" y="14" width="5" height="14" rx="2" fill="#6a4a5a" stroke="#c080a0" strokeWidth=".6"/><rect x="33" y="14" width="5" height="14" rx="2" fill="#6a4a5a" stroke="#c080a0" strokeWidth=".6"/></svg>,
table:<svg width={w} height={h} viewBox={v} style={s}><rect x="5" y="5" width="30" height="30" rx="2" fill="#4a4a30" stroke="#a0a060" strokeWidth="1.2"/><circle cx="20" cy="20" r="3" fill="none" stroke="#a0a060" strokeWidth=".5"/></svg>,
closet:<svg width={w} height={h} viewBox={v} style={s}><rect x="3" y="4" width="34" height="32" rx="1" fill="#3a4a3a" stroke="#70a070" strokeWidth="1.2"/><line x1="20" y1="4" x2="20" y2="36" stroke="#70a070" strokeWidth=".8"/><circle cx="17" cy="20" r="1.2" fill="#70a070"/><circle cx="23" cy="20" r="1.2" fill="#70a070"/></svg>,
shelf:<svg width={w} height={h} viewBox={v} style={s}><rect x="4" y="4" width="32" height="32" rx="1" fill="#3a4a3a" stroke="#70a070" strokeWidth="1"/><line x1="4" y1="14" x2="36" y2="14" stroke="#70a070" strokeWidth=".8"/><line x1="4" y1="24" x2="36" y2="24" stroke="#70a070" strokeWidth=".8"/></svg>,
luggage:<svg width={w} height={h} viewBox={v} style={s}><rect x="8" y="10" width="24" height="24" rx="3" fill="#4a3a50" stroke="#9080a0" strokeWidth="1"/><rect x="14" y="6" width="12" height="4" rx="1" fill="none" stroke="#9080a0" strokeWidth=".8"/><line x1="14" y1="22" x2="26" y2="22" stroke="#9080a0" strokeWidth=".6"/></svg>,
safe:<svg width={w} height={h} viewBox={v} style={s}><rect x="6" y="8" width="28" height="24" rx="2" fill="#3a3a40" stroke="#8a8a9a" strokeWidth="1.2"/><circle cx="20" cy="20" r="5" fill="none" stroke="#8a8a9a" strokeWidth=".8"/><line x1="20" y1="15" x2="20" y2="20" stroke="#8a8a9a" strokeWidth=".8"/></svg>,
counter:<svg width={w} height={h} viewBox={v} style={s}><rect x="2" y="12" width="36" height="16" rx="1" fill="#4a3a2a" stroke="#c09060" strokeWidth="1.2"/><line x1="5" y1="28" x2="5" y2="36" stroke="#c09060" strokeWidth="1.5"/><line x1="35" y1="28" x2="35" y2="36" stroke="#c09060" strokeWidth="1.5"/></svg>,
mirror:<svg width={w} height={h} viewBox={v} style={s}><ellipse cx="20" cy="18" rx="10" ry="14" fill="#2a3040" stroke="#80a0c0" strokeWidth="1"/><line x1="20" y1="32" x2="20" y2="37" stroke="#80a0c0" strokeWidth="1.5"/><line x1="14" y1="37" x2="26" y2="37" stroke="#80a0c0" strokeWidth="1"/></svg>,
curtain:<svg width={w} height={h} viewBox={v} style={s}><line x1="4" y1="6" x2="36" y2="6" stroke="#8070a0" strokeWidth="1.5"/><path d="M4,6 Q10,20 4,36" fill="none" stroke="#8070a0" strokeWidth=".8"/><path d="M20,6 Q14,20 20,36" fill="none" stroke="#8070a0" strokeWidth=".8"/><path d="M20,6 Q26,20 20,36" fill="none" stroke="#8070a0" strokeWidth=".8"/><path d="M36,6 Q30,20 36,36" fill="none" stroke="#8070a0" strokeWidth=".8"/></svg>,
plant:<svg width={w} height={h} viewBox={v} style={s}><rect x="14" y="26" width="12" height="12" rx="1" fill="#4a3a2a" stroke="#8a7a5a" strokeWidth=".8"/><circle cx="20" cy="16" r="10" fill="#2a4a2a" stroke="#5a9a5a" strokeWidth="1"/><circle cx="15" cy="12" r="4" fill="none" stroke="#5a9a5a" strokeWidth=".5"/><circle cx="25" cy="14" r="3" fill="none" stroke="#5a9a5a" strokeWidth=".5"/></svg>,
fire_ext:<svg width={w} height={h} viewBox={v} style={s}><rect x="14" y="8" width="12" height="28" rx="3" fill="#6a2020" stroke="#e04040" strokeWidth="1"/><rect x="16" y="4" width="8" height="4" rx="1" fill="#6a2020" stroke="#e04040" strokeWidth=".8"/><line x1="17" y1="2" x2="23" y2="2" stroke="#e04040" strokeWidth="1"/></svg>,
sign:<svg width={w} height={h} viewBox={v} style={s}><rect x="4" y="6" width="32" height="20" rx="2" fill="#2a4a2a" stroke="#4a8a4a" strokeWidth="1"/><text x="20" y="20" textAnchor="middle" fill="#4a8a4a" fontSize="10" fontWeight="700">EXIT</text><line x1="20" y1="26" x2="20" y2="36" stroke="#4a8a4a" strokeWidth="1"/></svg>,
wall:<svg width={w} height={h} viewBox={v} style={s}><rect x="4" y="16" width="32" height="8" rx="0" fill="#5a5a6a" stroke="#8a8a9a" strokeWidth="1.2"/></svg>,
door:<svg width={w} height={h} viewBox={v} style={s}><line x1="6" y1="34" x2="6" y2="6" stroke="#8aa0b0" strokeWidth="2"/><path d="M 6 6 A 28 28 0 0 1 34 34" fill="none" stroke="#8aa0b0" strokeWidth="1" strokeDasharray="3,2"/><line x1="6" y1="34" x2="34" y2="34" stroke="#8aa0b0" strokeWidth="1.5"/></svg>,
window:<svg width={w} height={h} viewBox={v} style={s}><line x1="4" y1="20" x2="36" y2="20" stroke="#80c0e0" strokeWidth="3"/><line x1="4" y1="17" x2="4" y2="23" stroke="#80c0e0" strokeWidth="1.5"/><line x1="36" y1="17" x2="36" y2="23" stroke="#80c0e0" strokeWidth="1.5"/><line x1="20" y1="17" x2="20" y2="23" stroke="#80c0e0" strokeWidth=".8"/></svg>,
sliding:<svg width={w} height={h} viewBox={v} style={s}><rect x="2" y="14" width="18" height="12" rx="0" fill="none" stroke="#8aa0b0" strokeWidth="1"/><rect x="16" y="14" width="22" height="12" rx="0" fill="none" stroke="#8aa0b0" strokeWidth="1"/><line x1="27" y1="20" x2="33" y2="20" stroke="#8aa0b0" strokeWidth="2"/></svg>,
stairs:<svg width={w} height={h} viewBox={v} style={s}><line x1="6" y1="6" x2="34" y2="6" stroke="#7a7a8a" strokeWidth=".8"/><line x1="6" y1="11" x2="34" y2="11" stroke="#7a7a8a" strokeWidth=".8"/><line x1="6" y1="16" x2="34" y2="16" stroke="#7a7a8a" strokeWidth=".8"/><line x1="6" y1="21" x2="34" y2="21" stroke="#7a7a8a" strokeWidth=".8"/><line x1="6" y1="26" x2="34" y2="26" stroke="#7a7a8a" strokeWidth=".8"/><line x1="6" y1="31" x2="34" y2="31" stroke="#7a7a8a" strokeWidth=".8"/><rect x="6" y="6" width="28" height="28" fill="none" stroke="#7a7a8a" strokeWidth="1"/></svg>,
text:<svg width={w} height={h} viewBox={v} style={s}><text x="20" y="28" textAnchor="middle" fill="#c0c0d0" fontSize="22" fontWeight="700" fontFamily="serif">T</text></svg>,
};return ic[t]||ic.text;};

/* ═══ PALETTE with 40+ hotel items ═══ */
const PAL=[
{cat:"建築",items:[{type:"wall",label:"壁",dW:2000,dH:150},{type:"door",label:"開きドア",dW:800,dH:800},{type:"sliding",label:"引き戸",dW:1800,dH:100},{type:"window",label:"窓",dW:1600,dH:100},{type:"stairs",label:"階段",dW:2700,dH:1200},{type:"partition",label:"パーティション",dW:1800,dH:80},{type:"pillar",label:"柱",dW:500,dH:500}]},
{cat:"寝具",items:[{type:"bed_s",label:"シングル",dW:1000,dH:2000},{type:"bed_sd",label:"セミダブル",dW:1200,dH:2000},{type:"bed_d",label:"ダブル",dW:1400,dH:2000},{type:"bunk",label:"二段ベッド",dW:1000,dH:2000},{type:"futon",label:"布団",dW:1000,dH:2100},{type:"crib",label:"ベビーベッド",dW:700,dH:1200},{type:"sofa_bed",label:"ソファベッド",dW:1400,dH:900}]},
{cat:"水回り",items:[{type:"toilet",label:"トイレ",dW:400,dH:700},{type:"sink",label:"洗面台",dW:600,dH:450},{type:"bath",label:"浴槽",dW:800,dH:1400},{type:"shower",label:"シャワー",dW:900,dH:900},{type:"unit_bath",label:"ユニットバス",dW:1600,dH:2000},{type:"bidet",label:"ビデ",dW:380,dH:600},{type:"laundry_sink",label:"スロップシンク",dW:500,dH:500}]},
{cat:"設備",items:[{type:"kitchen",label:"キッチン",dW:2400,dH:600},{type:"mini_kitchen",label:"ミニキッチン",dW:1200,dH:500},{type:"fridge",label:"冷蔵庫",dW:600,dH:650},{type:"washer",label:"洗濯機",dW:600,dH:600},{type:"dryer",label:"乾燥機",dW:600,dH:600},{type:"ac",label:"エアコン",dW:800,dH:200},{type:"tv",label:"テレビ",dW:1000,dH:100},{type:"counter",label:"カウンター",dW:1800,dH:500},{type:"heater",label:"給湯器",dW:400,dH:300},{type:"intercom",label:"インターホン",dW:200,dH:300}]},
{cat:"家具",items:[{type:"desk",label:"デスク",dW:1200,dH:600},{type:"chair",label:"椅子",dW:450,dH:450},{type:"sofa",label:"ソファ",dW:1800,dH:800},{type:"sofa_1",label:"一人掛ソファ",dW:800,dH:800},{type:"table",label:"テーブル",dW:800,dH:800},{type:"dining_table",label:"ダイニングテーブル",dW:1400,dH:800},{type:"coffee_table",label:"ローテーブル",dW:1000,dH:500},{type:"closet",label:"クローゼット",dW:1800,dH:600},{type:"shelf",label:"棚",dW:900,dH:400},{type:"tv_stand",label:"テレビ台",dW:1200,dH:400},{type:"wardrobe",label:"ワードローブ",dW:1000,dH:600},{type:"nightstand",label:"ナイトテーブル",dW:450,dH:400},{type:"dresser",label:"ドレッサー",dW:800,dH:400},{type:"curtain",label:"カーテン",dW:1600,dH:50}]},
{cat:"備品",items:[{type:"luggage",label:"荷物台",dW:600,dH:400},{type:"safe",label:"金庫",dW:400,dH:350},{type:"mirror",label:"鏡",dW:500,dH:50},{type:"plant",label:"観葉植物",dW:400,dH:400},{type:"fire_ext",label:"消火器",dW:200,dH:200},{type:"sign",label:"案内看板",dW:400,dH:300},{type:"trash",label:"ゴミ箱",dW:300,dH:300},{type:"umbrella",label:"傘立て",dW:300,dH:300},{type:"shoe_rack",label:"靴箱",dW:800,dH:350},{type:"smoke_det",label:"火災報知器",dW:150,dH:150},{type:"key_box",label:"キーボックス",dW:300,dH:200},{type:"amenity",label:"アメニティ棚",dW:600,dH:300}]},
{cat:"テキスト",items:[{type:"text",label:"テキスト追加",dW:0,dH:0}]},
];

const FILL={bed_s:"#3d3560",bed_sd:"#3d3560",bed_d:"#3d3560",bunk:"#3d3560",futon:"#4a4030",crib:"#4a3560",sofa_bed:"#4a3050",toilet:"#2a4a5a",sink:"#2a4a5a",bath:"#2a4a5a",shower:"#2a4a5a",unit_bath:"#2a4a5a",bidet:"#2a4a5a",laundry_sink:"#2a4a5a",kitchen:"#4a3020",mini_kitchen:"#4a3020",fridge:"#2a3a4a",washer:"#2a3a4a",dryer:"#2a3a4a",ac:"#2a3a5a",tv:"#1a2030",desk:"#4a4a30",chair:"#4a4a30",sofa:"#5a3a4a",sofa_1:"#5a3a4a",table:"#4a4a30",dining_table:"#4a4a30",coffee_table:"#4a4a30",closet:"#3a4a3a",shelf:"#3a4a3a",tv_stand:"#3a3a40",wardrobe:"#3a4a3a",nightstand:"#4a4a30",dresser:"#4a4a30",luggage:"#4a3a50",safe:"#3a3a40",counter:"#4a3a2a",mirror:"#2a3040",curtain:"#3a3050",plant:"#2a4a2a",fire_ext:"#6a2020",sign:"#2a4a2a",trash:"#3a3a3a",umbrella:"#3a3a4a",shoe_rack:"#4a3a2a",smoke_det:"#5a2020",key_box:"#3a3a40",amenity:"#3a4a4a",partition:"#4a4a5a",pillar:"#3a3a3a",heater:"#4a3a2a",intercom:"#3a3a40",wall:"#5a5a6a",door:"transparent",sliding:"transparent",window:"transparent",stairs:"#1a1a2a",text:"transparent"};

const STROKE={bed_s:"#7b68ee",bed_sd:"#9b88ff",bed_d:"#7b68ee",bunk:"#7b68ee",futon:"#b8a060",crib:"#9b78ee",sofa_bed:"#c080a0",toilet:"#5aa8c8",sink:"#5aa8c8",bath:"#5aa8c8",shower:"#5aa8c8",unit_bath:"#5aa8c8",bidet:"#5aa8c8",laundry_sink:"#5aa8c8",kitchen:"#c87040",mini_kitchen:"#c87040",fridge:"#6a8a9a",washer:"#6a8a9a",dryer:"#6a8a9a",ac:"#6a9aba",tv:"#6080a0",desk:"#a0a060",chair:"#a0a060",sofa:"#c080a0",sofa_1:"#c080a0",table:"#a0a060",dining_table:"#a0a060",coffee_table:"#a0a060",closet:"#70a070",shelf:"#70a070",tv_stand:"#8a8a9a",wardrobe:"#70a070",nightstand:"#a0a060",dresser:"#a0a060",luggage:"#9080a0",safe:"#8a8a9a",counter:"#c09060",mirror:"#80a0c0",curtain:"#8070a0",plant:"#5a9a5a",fire_ext:"#e04040",sign:"#4a8a4a",trash:"#8a8a8a",umbrella:"#7a7a9a",shoe_rack:"#a08060",smoke_det:"#e06060",key_box:"#8a8a9a",amenity:"#5a8a8a",partition:"#8a8a9a",pillar:"#8a8a8a",heater:"#c09060",intercom:"#8a8a9a",wall:"#8a8a9a",door:"#8aa0b0",sliding:"#8aa0b0",window:"#80c0e0",stairs:"#7a7a8a",text:"#889"};

/* ═══ INLINE SVG DRAWING for items on canvas ═══ */
function ItemGfx({x,y,w,h,type,color,stroke:sk}){
  const s=sk||STROKE[type]||"#888";
  const f=color||FILL[type]||"#333";
  // Beds: pillow + mattress outline
  if(type==='bed_s'||type==='bed_sd'||type==='bed_d'||type==='sofa_bed'||type==='crib')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.3} fill={f} fillOpacity={.6} stroke={s} strokeWidth={.18}/>
    <rect x={x+w*.06} y={y+h*.03} width={w*.88} height={h*.18} rx={h*.06} fill={f} stroke={s} strokeWidth={.12}/>
    <rect x={x+w*.1} y={y+h*.28} width={w*.8} height={h*.65} rx={.2} fill="none" stroke={s} strokeWidth={.1} strokeDasharray=".6,.3"/>
  </g>;
  if(type==='bunk')return <g>
    <rect x={x} y={y} width={w} height={h*.47} rx={.2} fill={f} fillOpacity={.6} stroke={s} strokeWidth={.18}/>
    <rect x={x} y={y+h*.53} width={w} height={h*.47} rx={.2} fill={f} fillOpacity={.6} stroke={s} strokeWidth={.18}/>
    <rect x={x+w*.08} y={y+h*.04} width={w*.84} height={h*.1} rx={.15} fill={f} stroke={s} strokeWidth={.08}/>
    <rect x={x+w*.08} y={y+h*.57} width={w*.84} height={h*.1} rx={.15} fill={f} stroke={s} strokeWidth={.08}/>
  </g>;
  if(type==='futon')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.4} fill={f} fillOpacity={.5} stroke={s} strokeWidth={.18}/>
    <rect x={x+w*.08} y={y+h*.04} width={w*.84} height={h*.15} rx={.3} fill={f} stroke={s} strokeWidth={.1}/>
    <line x1={x} y1={y+h*.22} x2={x+w} y2={y+h*.22} stroke={s} strokeWidth={.08}/>
  </g>;
  // Toilet: tank + bowl
  if(type==='toilet'||type==='bidet')return <g>
    <rect x={x+w*.15} y={y} width={w*.7} height={h*.35} rx={.3} fill={f} stroke={s} strokeWidth={.15}/>
    <ellipse cx={x+w/2} cy={y+h*.68} rx={w*.42} ry={h*.3} fill={f} stroke={s} strokeWidth={.15}/>
    <ellipse cx={x+w/2} cy={y+h*.65} rx={w*.25} ry={h*.2} fill="none" stroke={s} strokeWidth={.1}/>
  </g>;
  // Sink: basin with faucet
  if(type==='sink'||type==='laundry_sink')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.4} fill={f} stroke={s} strokeWidth={.15}/>
    <ellipse cx={x+w/2} cy={y+h*.55} rx={w*.35} ry={h*.3} fill="none" stroke={s} strokeWidth={.12}/>
    <circle cx={x+w/2} cy={y+h*.55} r={w*.06} fill={s}/>
    <line x1={x+w/2} y1={y} x2={x+w/2} y2={y-h*.1} stroke={s} strokeWidth={.15}/>
  </g>;
  // Bath
  if(type==='bath')return <g>
    <rect x={x} y={y} width={w} height={h} rx={w*.1} fill={f} stroke={s} strokeWidth={.18}/>
    <rect x={x+w*.1} y={y+h*.08} width={w*.8} height={h*.84} rx={w*.06} fill="none" stroke={s} strokeWidth={.1}/>
    <circle cx={x+w*.85} cy={y+h*.12} r={w*.05} fill={s}/>
  </g>;
  // Shower
  if(type==='shower')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.3} fill={f} stroke={s} strokeWidth={.15}/>
    <circle cx={x+w/2} cy={y+h*.3} r={w*.2} fill="none" stroke={s} strokeWidth={.1}/>
    <line x1={x+w/2} y1={y+h*.5} x2={x+w/2} y2={y+h*.75} stroke={s} strokeWidth={.1}/>
    <line x1={x+w*.3} y1={y+h*.75} x2={x+w*.7} y2={y+h*.75} stroke={s} strokeWidth={.1}/>
  </g>;
  // Unit bath
  if(type==='unit_bath')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.2} fill={f} stroke={s} strokeWidth={.18}/>
    <rect x={x+w*.05} y={y+h*.05} width={w*.55} height={h*.5} rx={.3} fill="none" stroke={s} strokeWidth={.1}/>
    <ellipse cx={x+w*.75} cy={y+h*.25} rx={w*.12} ry={h*.1} fill="none" stroke={s} strokeWidth={.08}/>
    <ellipse cx={x+w*.4} cy={y+h*.75} rx={w*.15} ry={h*.12} fill="none" stroke={s} strokeWidth={.08}/>
  </g>;
  // Kitchen / stove
  if(type==='kitchen'||type==='mini_kitchen')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.2} fill={f} stroke={s} strokeWidth={.18}/>
    <circle cx={x+w*.2} cy={y+h*.35} r={w*.08} fill="none" stroke={s} strokeWidth={.1}/>
    <circle cx={x+w*.4} cy={y+h*.35} r={w*.08} fill="none" stroke={s} strokeWidth={.1}/>
    <rect x={x+w*.6} y={y+h*.15} width={w*.3} height={h*.5} rx={.2} fill="none" stroke={s} strokeWidth={.08}/>
    <ellipse cx={x+w*.75} cy={y+h*.4} rx={w*.08} ry={h*.15} fill="none" stroke={s} strokeWidth={.06}/>
  </g>;
  // Fridge
  if(type==='fridge')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.2} fill={f} stroke={s} strokeWidth={.18}/>
    <line x1={x} y1={y+h*.4} x2={x+w} y2={y+h*.4} stroke={s} strokeWidth={.1}/>
    <rect x={x+w*.75} y={y+h*.15} width={w*.06} height={h*.15} rx={.1} fill={s}/>
    <rect x={x+w*.75} y={y+h*.55} width={w*.06} height={h*.15} rx={.1} fill={s}/>
  </g>;
  // Washer / dryer
  if(type==='washer'||type==='dryer')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.3} fill={f} stroke={s} strokeWidth={.18}/>
    <circle cx={x+w/2} cy={y+h*.58} r={w*.3} fill="none" stroke={s} strokeWidth={.12}/>
    <circle cx={x+w*.25} cy={y+h*.18} r={w*.08} fill={s}/>
  </g>;
  // Sofa
  if(type==='sofa'||type==='sofa_1')return <g>
    <rect x={x} y={y+h*.15} width={w} height={h*.85} rx={.5} fill={f} fillOpacity={.6} stroke={s} strokeWidth={.18}/>
    <rect x={x+w*.06} y={y} width={w*.88} height={h*.3} rx={.3} fill={f} stroke={s} strokeWidth={.1}/>
    <rect x={x} y={y+h*.25} width={w*.1} height={h*.6} rx={.15} fill={f} stroke={s} strokeWidth={.08}/>
    <rect x={x+w*.9} y={y+h*.25} width={w*.1} height={h*.6} rx={.15} fill={f} stroke={s} strokeWidth={.08}/>
  </g>;
  // Closet / wardrobe
  if(type==='closet'||type==='wardrobe')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.15} fill={f} stroke={s} strokeWidth={.18}/>
    <line x1={x+w/2} y1={y} x2={x+w/2} y2={y+h} stroke={s} strokeWidth={.1}/>
    <circle cx={x+w*.45} cy={y+h/2} r={w*.03} fill={s}/><circle cx={x+w*.55} cy={y+h/2} r={w*.03} fill={s}/>
  </g>;
  // Plant
  if(type==='plant')return <g>
    <rect x={x+w*.25} y={y+h*.55} width={w*.5} height={h*.45} rx={.15} fill="#4a3a2a" stroke="#8a7a5a" strokeWidth={.1}/>
    <circle cx={x+w/2} cy={y+h*.35} r={w*.35} fill={f} stroke={s} strokeWidth={.15}/>
    <circle cx={x+w*.35} cy={y+h*.25} r={w*.12} fill="none" stroke={s} strokeWidth={.06}/>
  </g>;
  // TV
  if(type==='tv')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.1} fill={f} stroke={s} strokeWidth={.15}/>
    <rect x={x+w*.05} y={y+h*.1} width={w*.9} height={h*.6} rx={.05} fill="none" stroke={s} strokeWidth={.06}/>
  </g>;
  // AC
  if(type==='ac')return <g>
    <rect x={x} y={y} width={w} height={h} rx={.3} fill={f} stroke={s} strokeWidth={.15}/>
    <line x1={x+w*.15} y1={y+h} x2={x+w*.15} y2={y+h*1.5} stroke={s} strokeWidth={.06} strokeDasharray=".4,.3"/>
    <line x1={x+w*.5} y1={y+h} x2={x+w*.5} y2={y+h*1.5} stroke={s} strokeWidth={.06} strokeDasharray=".4,.3"/>
    <line x1={x+w*.85} y1={y+h} x2={x+w*.85} y2={y+h*1.5} stroke={s} strokeWidth={.06} strokeDasharray=".4,.3"/>
  </g>;
  // Fire extinguisher
  if(type==='fire_ext')return <g>
    <rect x={x+w*.25} y={y+h*.15} width={w*.5} height={h*.8} rx={w*.15} fill={f} stroke={s} strokeWidth={.15}/>
    <rect x={x+w*.3} y={y} width={w*.4} height={h*.15} rx={.1} fill={f} stroke={s} strokeWidth={.1}/>
  </g>;
  // Chair
  if(type==='chair')return <g>
    <rect x={x+w*.1} y={y+h*.4} width={w*.8} height={h*.6} rx={.2} fill={f} stroke={s} strokeWidth={.15}/>
    <rect x={x+w*.1} y={y} width={w*.8} height={h*.35} rx={.2} fill="none" stroke={s} strokeWidth={.1}/>
  </g>;
  // Default: labeled rect
  return <g>
    <rect x={x} y={y} width={w} height={h} rx={.3} fill={f} fillOpacity={.6} stroke={s} strokeWidth={.18}/>
  </g>;
}

/* ═══ DIMENSION LINE RENDERER ═══ */
function DimLines({dims,bw,bh}){
  if(!dims) return null;
  const off=4, off2=8, tk=1.2;
  const els=[];
  // Top
  (dims.top||[]).forEach((d,i)=>{
    const y=-(d.row===2?off2:off);
    els.push(<g key={`t${i}`}><line x1={d.x1} y1={y} x2={d.x2} y2={y} stroke="#556" strokeWidth={.2}/><line x1={d.x1} y1={y-tk} x2={d.x1} y2={y+tk} stroke="#556" strokeWidth={.2}/><line x1={d.x2} y1={y-tk} x2={d.x2} y2={y+tk} stroke="#556" strokeWidth={.2}/><text x={(d.x1+d.x2)/2} y={y-1} textAnchor="middle" fill="#778" fontSize={1.8} fontFamily="monospace">{d.l}</text></g>);
  });
  // Bottom
  (dims.bottom||[]).forEach((d,i)=>{
    const y=bh+(d.row===2?off2:off);
    els.push(<g key={`b${i}`}><line x1={d.x1} y1={y} x2={d.x2} y2={y} stroke="#556" strokeWidth={.2}/><line x1={d.x1} y1={y-tk} x2={d.x1} y2={y+tk} stroke="#556" strokeWidth={.2}/><line x1={d.x2} y1={y-tk} x2={d.x2} y2={y+tk} stroke="#556" strokeWidth={.2}/><text x={(d.x1+d.x2)/2} y={y-1} textAnchor="middle" fill="#778" fontSize={1.8} fontFamily="monospace">{d.l}</text></g>);
  });
  // Left
  (dims.left||[]).forEach((d,i)=>{
    const x=-(d.col===2?off2:off);
    els.push(<g key={`l${i}`}><line x1={x} y1={d.y1} x2={x} y2={d.y2} stroke="#556" strokeWidth={.2}/><line x1={x-tk} y1={d.y1} x2={x+tk} y2={d.y1} stroke="#556" strokeWidth={.2}/><line x1={x-tk} y1={d.y2} x2={x+tk} y2={d.y2} stroke="#556" strokeWidth={.2}/><text x={x} y={(d.y1+d.y2)/2+.6} textAnchor="middle" fill="#778" fontSize={1.8} fontFamily="monospace" transform={`rotate(-90,${x},${(d.y1+d.y2)/2+.6})`}>{d.l}</text></g>);
  });
  // Right
  (dims.right||[]).forEach((d,i)=>{
    const x=bw+(d.col===2?off2:d.col===3?12:off);
    els.push(<g key={`r${i}`}><line x1={x} y1={d.y1} x2={x} y2={d.y2} stroke="#556" strokeWidth={.2}/><line x1={x-tk} y1={d.y1} x2={x+tk} y2={d.y1} stroke="#556" strokeWidth={.2}/><line x1={x-tk} y1={d.y2} x2={x+tk} y2={d.y2} stroke="#556" strokeWidth={.2}/><text x={x} y={(d.y1+d.y2)/2+.6} textAnchor="middle" fill="#778" fontSize={1.8} fontFamily="monospace" transform={`rotate(90,${x},${(d.y1+d.y2)/2+.6})`}>{d.l}</text></g>);
  });
  return <g>{els}</g>;
}

/* ═══ COLOR PRESETS ═══ */
const COLORS=["#3d3560","#5b4a8a","#2a4a5a","#4a3020","#5a3a4a","#2a3a4a","#4a4a30","#3a4a3a","#6a2020","#2a4a2a","#5a5a6a","#1a2030","#4a3a50","#7a5a30","#3a3050"];

let _id=100;

/* Convert floor blueprint data into editable items */
function initFloor(fd){
  const items=[];
  // walls
  (fd.walls||[]).forEach(w=>{items.push({id:`init${_id++}`,type:w.t==="o"?"wall_outer":"wall_inner",x:w.x,y:w.y,w:w.w,h:w.h,label:w.t==="o"?"外壁":"内壁",color:w.t==="o"?"#4a4a5a":"#3a3a4a",cat:"structure"});});
  // columns
  (fd.columns||[]).forEach(c=>{items.push({id:`init${_id++}`,type:"column",x:c.x,y:c.y,w:c.s,h:c.s,label:"柱",color:"#2a2a3a",cat:"structure"});});
  // builtins
  (fd.builtins||[]).forEach(f=>{items.push({id:`init${_id++}`,type:f.type||"fixture",x:f.x,y:f.y,w:f.w,h:f.h,label:f.type==="stove"?"キッチン":f.type==="toilet"?"トイレ":f.type==="sink"?"洗面台":"設備",color:FILL[f.type]||"#1e2030",cat:"builtin"});});
  // room labels
  (fd.rooms||[]).forEach(r=>{items.push({id:`init${_id++}`,type:"text",x:r.x,y:r.y,w:0,h:0,label:r.label,fontSize:r.large?4:2.8,color:"#8899aa",cat:"label",sub:r.sub||""});});
  return items;
}

export default function App(){
  const[floor,setFloor]=useState("1F");
  const[placed,setPlaced]=useState(()=>{
    // Restore from localStorage if available
    try{
      const saved=localStorage.getItem('floorplan_data');
      if(saved){const parsed=JSON.parse(saved);if(parsed&&typeof parsed==='object'&&Object.keys(parsed).length>0)return parsed;}
    }catch(e){}
    // Otherwise initialize from floor data
    const init={};
    Object.entries(FLOORS).forEach(([k,fd])=>{init[k]=initFloor(fd);});
    return init;
  });
  const[selId,setSelId]=useState(null);
  const[dragId,setDragId]=useState(null);
  const[dragOff,setDragOff]=useState({x:0,y:0});
  const[cat,setCat]=useState("寝具");
  const[sW,setSW]=useState("");
  const[sH,setSH]=useState("");
  const[zoom,setZoom]=useState(1);
  const[pan,setPan]=useState({x:0,y:0});
  const[isPan,setIsPan]=useState(false);
  const[panS,setPanS]=useState({x:0,y:0});
  const[history,setHistory]=useState({});
  const[saveStatus,setSaveStatus]=useState("");
  const ref=useRef(null);
  const dragStartSnap=useRef(false);

  // Auto-save to localStorage whenever placed changes (debounced)
  useEffect(()=>{
    const timer=setTimeout(()=>{
      try{
        localStorage.setItem('floorplan_data',JSON.stringify(placed));
        setSaveStatus("保存済み");
        setTimeout(()=>setSaveStatus(""),2000);
      }catch(e){}
    },500);
    return()=>clearTimeout(timer);
  },[placed]);

  const fd=FLOORS[floor];
  const items=placed[floor]||[];

  /* Save snapshot for undo (before mutation) */
  const pushUndo=useCallback(()=>{
    setHistory(h=>({...h,[floor]:[...(h[floor]||[]).slice(-30),JSON.stringify(placed[floor]||[])]}));
  },[floor,placed]);

  const undo=useCallback(()=>{
    setHistory(h=>{
      const stack=h[floor]||[];
      if(!stack.length)return h;
      const prev=stack[stack.length-1];
      const newStack=stack.slice(0,-1);
      setPlaced(p=>({...p,[floor]:JSON.parse(prev)}));
      setSelId(null);
      return{...h,[floor]:newStack};
    });
  },[floor]);

  const setItems=useCallback(fn=>{setPlaced(p=>({...p,[floor]:typeof fn==='function'?fn(p[floor]||[]):fn}));},[floor]);

  /* Reset a floor to its original state */
  const resetFloor=()=>{pushUndo();setPlaced(p=>({...p,[floor]:initFloor(fd)}));setSelId(null);};

  const toSvg=useCallback((cx,cy)=>{const el=ref.current;if(!el)return{x:0,y:0};const r=el.getBoundingClientRect();const vb=el.viewBox.baseVal;return{x:(cx-r.left)/r.width*vb.width,y:(cy-r.top)/r.height*vb.height};},[]);

  const add=p=>{
    pushUndo();
    if(p.type==='text'){const txt=prompt("テキストを入力:","");if(!txt)return;const id=`p${_id++}`;setItems(prev=>[...prev,{id,type:'text',x:fd.bw/2,y:fd.bh/2,w:0,h:0,label:txt,rot:0,fontSize:3,color:"#ccd"}]);setSelId(id);return;}
    const w=sW?parseFloat(sW)/100:p.dW/100;const h=sH?parseFloat(sH)/100:p.dH/100;const id=`p${_id++}`;
    setItems(prev=>[...prev,{id,type:p.type,x:fd.bw/2-w/2,y:fd.bh/2-h/2,w,h,label:p.label,rot:0,color:FILL[p.type]}]);
    setSelId(id);setSW("");setSH("");
  };

  const onDown=(e,id)=>{e.stopPropagation();const pt=toSvg(e.clientX,e.clientY);const it=items.find(i=>i.id===id);if(!it)return;pushUndo();setDragId(id);setDragOff({x:pt.x-it.x,y:pt.y-it.y});setSelId(id);};
  const onMove=e=>{if(dragId){const pt=toSvg(e.clientX,e.clientY);setItems(prev=>prev.map(i=>i.id===dragId?{...i,x:Math.round((pt.x-dragOff.x)*2)/2,y:Math.round((pt.y-dragOff.y)*2)/2}:i));}else if(isPan){setPan({x:e.clientX-panS.x,y:e.clientY-panS.y});}};
  const onUp=()=>{setDragId(null);setIsPan(false);};
  const onBg=e=>{if(e.target===ref.current||e.target.dataset.bg){setSelId(null);setIsPan(true);setPanS({x:e.clientX-pan.x,y:e.clientY-pan.y});}};

  const del=()=>{if(!selId)return;pushUndo();setItems(p=>p.filter(i=>i.id!==selId));setSelId(null);};
  const rot=()=>{if(!selId)return;pushUndo();setItems(p=>p.map(i=>i.id===selId?{...i,rot:((i.rot||0)+90)%360}:i));};
  const dup=()=>{const it=items.find(i=>i.id===selId);if(!it)return;pushUndo();const id=`p${_id++}`;setItems(p=>[...p,{...it,id,x:it.x+2,y:it.y+2}]);setSelId(id);};
  const setColor=(c)=>{if(!selId)return;pushUndo();setItems(p=>p.map(i=>i.id===selId?{...i,color:c}:i));};
  const resizeItem=(ww,hh)=>{if(!selId)return;pushUndo();setItems(p=>p.map(i=>i.id===selId?{...i,w:ww/100,h:hh/100}:i));};

  const[showExport,setShowExport]=useState(false);

  const sel=items.find(i=>i.id===selId);
  const vW=fd.bw+30,vH=fd.bh+30;

  return(
<div style={{display:'flex',height:'100vh',background:'#0f1117',color:'#ccd',fontFamily:"'Hiragino Kaku Gothic Pro','Meiryo','Yu Gothic',sans-serif",overflow:'hidden',fontSize:13}}>

{/* LEFT */}
<div style={{width:260,background:'#161822',borderRight:'1px solid #252836',display:'flex',flexDirection:'column',flexShrink:0,userSelect:'none'}}>
  <div style={{padding:'10px 8px',borderBottom:'1px solid #252836'}}>
    <div style={{fontSize:10,color:'#556',letterSpacing:1,marginBottom:5}}>階を選択</div>
    <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
      {Object.entries(FLOORS).map(([k,v])=><button key={k} onClick={()=>{setFloor(k);setSelId(null);}} style={{padding:'5px 10px',borderRadius:5,border:floor===k?'1px solid #e94560':'1px solid #2a2d3e',background:floor===k?'#e94560':'#1e2030',color:floor===k?'#fff':'#889',fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>{v.name}</button>)}
    </div>
    <div style={{fontSize:10,color:'#445',marginTop:4}}>{fd.sub}</div>
  </div>

  <div style={{padding:'8px',borderBottom:'1px solid #252836'}}>
    <div style={{fontSize:10,color:'#556',marginBottom:4}}>採寸入力 (mm)</div>
    <div style={{display:'flex',gap:5}}>
      <label style={{flex:1}}><span style={{fontSize:9,color:'#445'}}>幅W</span><input value={sW} onChange={e=>setSW(e.target.value)} placeholder="自動" style={inp}/></label>
      <label style={{flex:1}}><span style={{fontSize:9,color:'#445'}}>奥行D</span><input value={sH} onChange={e=>setSH(e.target.value)} placeholder="自動" style={inp}/></label>
    </div>
  </div>

  <div style={{padding:'5px 8px',borderBottom:'1px solid #252836',display:'flex',gap:2,flexWrap:'wrap'}}>
    {PAL.map(c=><button key={c.cat} onClick={()=>setCat(c.cat)} style={{padding:'2px 7px',borderRadius:10,border:'none',fontSize:10,cursor:'pointer',background:cat===c.cat?'#2a4a6a':'#1e2030',color:cat===c.cat?'#8cf':'#556',fontFamily:'inherit'}}>{c.cat}</button>)}
  </div>

  <div style={{flex:1,overflowY:'auto',padding:6}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
      {(PAL.find(c=>c.cat===cat)?.items||[]).map(p=>(
        <button key={p.type} onClick={()=>add(p)} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'6px 3px',background:'#1a1d2e',border:'1px solid #252836',borderRadius:8,cursor:'pointer',gap:3,transition:'border-color .15s'}}
          onMouseEnter={e=>e.currentTarget.style.borderColor='#4a5a7a'} onMouseLeave={e=>e.currentTarget.style.borderColor='#252836'}>
          <I t={p.type} w={42} h={42}/><span style={{fontSize:9,color:'#aab',textAlign:'center',lineHeight:'1.2'}}>{p.label}</span>
          {p.dW>0&&<span style={{fontSize:7,color:'#445'}}>{sW||p.dW}×{sH||p.dH}</span>}
        </button>
      ))}
    </div>
  </div>

  {sel&&<div style={{padding:8,borderTop:'1px solid #252836',background:'#1a1d2e',maxHeight:260,overflowY:'auto'}}>
    <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:3}}>
      <span style={{fontSize:11,color:'#e94560',fontWeight:500}}>{sel.label}</span>
      <span style={{fontSize:8,color:'#445',background:'#252836',padding:'1px 5px',borderRadius:8}}>{sel.type}</span>
    </div>
    {/* Rename */}
    <div style={{marginBottom:5}}>
      <input value={sel.label} onChange={e=>{const v=e.target.value;pushUndo();setItems(p=>p.map(i=>i.id===selId?{...i,label:v}:i));}} style={{...inp,fontSize:11,padding:'3px 6px'}}/>
    </div>
    {/* Resize */}
    {sel.w>0&&<div style={{marginBottom:5}}>
      <div style={{fontSize:9,color:'#556',marginBottom:2}}>サイズ変更 (mm)</div>
      <div style={{display:'flex',gap:4,alignItems:'center'}}>
        <label style={{flex:1}}><span style={{fontSize:8,color:'#445'}}>W</span>
          <input type="number" defaultValue={Math.round(sel.w*100)} key={selId+'w'+Math.round(sel.w*100)+'-'+(sel.rot||0)} onBlur={e=>{const v=parseFloat(e.target.value);if(v>0)resizeItem(v,Math.round(sel.h*100));}} onKeyDown={e=>{if(e.key==='Enter'){const v=parseFloat(e.target.value);if(v>0)resizeItem(v,Math.round(sel.h*100));}}} style={{...inp,fontSize:11,padding:'3px 5px'}}/></label>
        <span style={{color:'#334',marginTop:12}}>×</span>
        <label style={{flex:1}}><span style={{fontSize:8,color:'#445'}}>D</span>
          <input type="number" defaultValue={Math.round(sel.h*100)} key={selId+'h'+Math.round(sel.h*100)+'-'+(sel.rot||0)} onBlur={e=>{const v=parseFloat(e.target.value);if(v>0)resizeItem(Math.round(sel.w*100),v);}} onKeyDown={e=>{if(e.key==='Enter'){const v=parseFloat(e.target.value);if(v>0)resizeItem(Math.round(sel.w*100),v);}}} style={{...inp,fontSize:11,padding:'3px 5px'}}/></label>
      </div>
    </div>}
    {sel.w>0&&<div style={{fontSize:9,color:'#556',marginBottom:4}}>位置 ({(sel.x*100).toFixed(0)}, {(sel.y*100).toFixed(0)}) {sel.rot?`回転 ${sel.rot}°`:''}</div>}
    <div style={{display:'flex',gap:4,marginBottom:6}}>
      {sel.type!=='text'&&sel.w>0&&<button onClick={rot} style={actBtn("#2a3a5a","#8cf")}>↻回転{sel.rot?` ${sel.rot}°`:''}</button>}
      <button onClick={dup} style={actBtn("#2a4a3a","#8f8")}>⧉複製</button>
      <button onClick={del} style={actBtn("#5a2a2a","#f88")}>✕削除</button>
    </div>
    <div style={{fontSize:9,color:'#556',marginBottom:3}}>色変更:</div>
    <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
      {COLORS.map(c=><div key={c} onClick={()=>setColor(c)} style={{width:16,height:16,borderRadius:3,background:c,cursor:'pointer',border:sel.color===c?'2px solid #e94560':'2px solid transparent'}}/>)}
    </div>
  </div>}
</div>

{/* MAIN */}
<div style={{flex:1,display:'flex',flexDirection:'column'}}>
  <div style={{padding:'5px 14px',background:'#161822',borderBottom:'1px solid #252836',display:'flex',alignItems:'center',gap:10}}>
    <span style={{fontSize:13,fontWeight:700,color:'#e94560'}}>間取り図エディタ</span>
    <span style={{fontSize:10,color:'#445'}}>— {fd.name} {fd.sub}</span>
    <div style={{marginLeft:'auto',display:'flex',gap:5}}>
      <button onClick={undo} disabled={!(history[floor]||[]).length} style={{...tb,background:(history[floor]||[]).length?'#2a2a5a':'#1a1a2a',color:(history[floor]||[]).length?'#aaf':'#334',borderColor:(history[floor]||[]).length?'#3a3a6a':'#222'}}>↩ 戻る</button>
      <button onClick={()=>setZoom(z=>Math.min(3,z*1.25))} style={tb}>＋</button>
      <button onClick={()=>setZoom(z=>Math.max(.3,z/1.25))} style={tb}>−</button>
      <button onClick={()=>{setZoom(1);setPan({x:0,y:0});}} style={tb}>表示リセット</button>
      <button onClick={resetFloor} style={{...tb,background:'#3a2a1a',color:'#da6',borderColor:'#5a4a2a'}}>🔄 図面リセット</button>
      <button onClick={()=>setShowExport(true)} style={{...tb,background:'#1a3a2a',color:'#6d8',borderColor:'#2a5a3a'}}>📄 図面出力</button>
    </div>
  </div>

  <div style={{flex:1,overflow:'hidden',position:'relative',background:'#0c0e16',cursor:dragId?'grabbing':isPan?'grabbing':'crosshair'}}
    onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
    <svg ref={ref} viewBox={`-15 -15 ${vW} ${vH}`}
      style={{width:vW*PX*zoom,height:vH*PX*zoom,position:'absolute',
        left:pan.x+(window.innerWidth-260)/2-vW*PX*zoom/2,
        top:pan.y+(window.innerHeight-42)/2-vH*PX*zoom/2}}
      onMouseDown={onBg}>
      <rect data-bg="1" x={-15} y={-15} width={vW} height={vH} fill="#0c0e16"/>
      {Array.from({length:Math.ceil(fd.bw/10)+1}).map((_,i)=><line key={`v${i}`} x1={i*10} y1={0} x2={i*10} y2={fd.bh} stroke="#151820" strokeWidth={.15}/>)}
      {Array.from({length:Math.ceil(fd.bh/10)+1}).map((_,i)=><line key={`h${i}`} x1={0} y1={i*10} x2={fd.bw} y2={i*10} stroke="#151820" strokeWidth={.15}/>)}

      {/* Dimension lines */}
      <DimLines dims={fd.dims} bw={fd.bw} bh={fd.bh}/>

      {/* ALL items - walls, rooms, fixtures, user-placed - all editable */}
      {items.map(it=>{
        const isSel=it.id===selId;
        const selStroke="#e94560";

        /* ── Structure: walls ── */
        if(it.type==='wall_outer'||it.type==='wall_inner')return(
          <rect key={it.id} x={it.x} y={it.y} width={it.w} height={it.h}
            fill={it.color||"#4a4a5a"} stroke={isSel?selStroke:it.type==='wall_outer'?"#5a5a6a":"#4a4a5a"} strokeWidth={isSel?.3:.12}
            onMouseDown={e=>onDown(e,it.id)} style={{cursor:'move'}}/>);

        /* ── Columns ── */
        if(it.type==='column')return(
          <g key={it.id} onMouseDown={e=>onDown(e,it.id)} style={{cursor:'move'}}>
            <rect x={it.x} y={it.y} width={it.w} height={it.h} fill={it.color||"#2a2a3a"} stroke={isSel?selStroke:"#4a4a5a"} strokeWidth={isSel?.3:.15}/>
            <line x1={it.x} y1={it.y} x2={it.x+it.w} y2={it.y+it.h} stroke="#4a4a5a" strokeWidth={.1}/>
            <line x1={it.x+it.w} y1={it.y} x2={it.x} y2={it.y+it.h} stroke="#4a4a5a" strokeWidth={.1}/>
          </g>);

        /* ── Room labels (text) ── */
        if(it.type==='text')return(
          <g key={it.id} onMouseDown={e=>onDown(e,it.id)} style={{cursor:'move'}}>
            <text x={it.x} y={it.y} textAnchor="middle" fill={it.color||"#8899aa"} fontSize={it.fontSize||3} fontWeight={it.fontSize>=4?700:400} fontFamily="'Hiragino Kaku Gothic Pro','Meiryo',sans-serif" style={{userSelect:'none'}}>{it.label}</text>
            {it.sub&&<text x={it.x} y={it.y+3.2} textAnchor="middle" fill="#556677" fontSize={2} fontFamily="'Hiragino Kaku Gothic Pro','Meiryo',sans-serif">{it.sub}</text>}
            {isSel&&<rect x={it.x-it.label.length*1.2} y={it.y-(it.fontSize||3)-1} width={it.label.length*2.4} height={(it.fontSize||3)+2} fill="none" stroke={selStroke} strokeWidth={.2} strokeDasharray="1,.5"/>}
          </g>);

        /* ── Doors ── */
        if(it.type==='door'){const r=it.rot||0;const cx=it.x+it.w/2,cy=it.y+it.h/2;return(
          <g key={it.id} onMouseDown={e=>onDown(e,it.id)} style={{cursor:'move'}} transform={r?`rotate(${r},${cx},${cy})`:undefined}>
            <rect x={it.x} y={it.y} width={it.w} height={it.h} fill="transparent"/>
            <line x1={it.x} y1={it.y+it.h} x2={it.x} y2={it.y} stroke={isSel?selStroke:"#8aa0b0"} strokeWidth={.4}/>
            <path d={`M ${it.x} ${it.y} A ${it.w} ${it.w} 0 0 1 ${it.x+it.w} ${it.y+it.h}`} fill="none" stroke={isSel?selStroke:"#8aa0b0"} strokeWidth={.25} strokeDasharray="1,.5"/>
            <line x1={it.x} y1={it.y+it.h} x2={it.x+it.w} y2={it.y+it.h} stroke={isSel?selStroke:"#8aa0b0"} strokeWidth={.3}/>
            {isSel&&<rect x={it.x-.5} y={it.y-.5} width={it.w+1} height={it.h+1} fill="none" stroke={selStroke} strokeWidth={.15} strokeDasharray="1,.5"/>}
          </g>);}

        /* ── Windows ── */
        if(it.type==='window'){const r=it.rot||0;const cx=it.x+it.w/2,cy=it.y+it.h/2;return(
          <g key={it.id} onMouseDown={e=>onDown(e,it.id)} style={{cursor:'move'}} transform={r?`rotate(${r},${cx},${cy})`:undefined}>
            <rect x={it.x} y={it.y} width={it.w} height={it.h} fill="transparent"/>
            <line x1={it.x} y1={it.y+it.h/2} x2={it.x+it.w} y2={it.y+it.h/2} stroke={isSel?selStroke:"#80c0e0"} strokeWidth={.6}/>
            <line x1={it.x} y1={it.y} x2={it.x} y2={it.y+it.h} stroke="#80c0e0" strokeWidth={.3}/>
            <line x1={it.x+it.w} y1={it.y} x2={it.x+it.w} y2={it.y+it.h} stroke="#80c0e0" strokeWidth={.3}/>
            {isSel&&<rect x={it.x-.5} y={it.y-.5} width={it.w+1} height={it.h+1} fill="none" stroke={selStroke} strokeWidth={.15} strokeDasharray="1,.5"/>}
          </g>);}

        /* ── Sliding doors ── */
        if(it.type==='sliding'){const r=it.rot||0;const cx=it.x+it.w/2,cy=it.y+it.h/2;return(
          <g key={it.id} onMouseDown={e=>onDown(e,it.id)} style={{cursor:'move'}} transform={r?`rotate(${r},${cx},${cy})`:undefined}>
            <rect x={it.x} y={it.y} width={it.w*.55} height={it.h} fill="none" stroke={isSel?selStroke:"#8aa0b0"} strokeWidth={.25}/>
            <rect x={it.x+it.w*.4} y={it.y} width={it.w*.6} height={it.h} fill="none" stroke={isSel?selStroke:"#8aa0b0"} strokeWidth={.25}/>
          </g>);}

        /* ── Stairs ── */
        if(it.type==='stairs'){const steps=Math.round(it.h/2);const r=it.rot||0;const cx=it.x+it.w/2,cy=it.y+it.h/2;return(
          <g key={it.id} onMouseDown={e=>onDown(e,it.id)} style={{cursor:'move'}} transform={r?`rotate(${r},${cx},${cy})`:undefined}>
            <rect x={it.x} y={it.y} width={it.w} height={it.h} fill="#1a1a2a" stroke={isSel?selStroke:"#5a5a6a"} strokeWidth={.2}/>
            {Array.from({length:steps}).map((_,j)=><line key={j} x1={it.x} y1={it.y+j*(it.h/steps)} x2={it.x+it.w} y2={it.y+j*(it.h/steps)} stroke="#4a4a5a" strokeWidth={.15}/>)}
          </g>);}

        /* ── Default: furniture / fixtures with illustrations ── */
        {const r=it.rot||0;
        const cx=it.x+it.w/2, cy=it.y+it.h/2;
        // When rotated 90/270, visual bounding box swaps
        const isSwapped=r===90||r===270;
        const dispW=isSwapped?it.h:it.w, dispH=isSwapped?it.w:it.h;
        return(
          <g key={it.id} onMouseDown={e=>onDown(e,it.id)} style={{cursor:'move'}}>
            {/* Invisible hit area at actual position */}
            <rect x={it.x} y={it.y} width={it.w} height={it.h} fill="transparent" stroke="none"/>
            {/* Rotated illustration */}
            <g transform={r?`rotate(${r},${cx},${cy})`:undefined}>
              <ItemGfx x={cx-dispW/2} y={cy-dispH/2} w={dispW} h={dispH} type={it.type} color={it.color} stroke={isSel?selStroke:null}/>
            </g>
            {isSel&&<rect x={it.x-.2} y={it.y-.2} width={it.w+.4} height={it.h+.4} fill="none" stroke={selStroke} strokeWidth={.2} strokeDasharray=".8,.4"/>}
            <text x={cx} y={cy+.6} textAnchor="middle" fill="#dde" fontSize={Math.min(it.w,it.h)>5?2:Math.min(it.w,it.h)>3?1.4:1} fontFamily="sans-serif">{it.label}</text>
            {it.w>2&&it.h>2&&<text x={cx} y={cy+2.8} textAnchor="middle" fill="#667" fontSize={1.1} fontFamily="monospace">{(it.w*100).toFixed(0)}×{(it.h*100).toFixed(0)}</text>}
            {isSel&&<g>{[[-.3,-.3],[it.w-.5,-.3],[-.3,it.h-.5],[it.w-.5,it.h-.5]].map(([dx,dy],j)=><rect key={j} x={it.x+dx} y={it.y+dy} width={.8} height={.8} fill={selStroke} rx={.15}/>)}</g>}
          </g>);}
      })}

      {/* Scale bar */}
      <line x1={0} y1={fd.bh+4} x2={10} y2={fd.bh+4} stroke="#445" strokeWidth={.25}/>
      <text x={5} y={fd.bh+7} textAnchor="middle" fill="#445" fontSize={1.8} fontFamily="monospace">1m</text>
    </svg>
  </div>

  <div style={{padding:'3px 14px',background:'#0d1020',borderTop:'1px solid #252836',fontSize:10,color:'#334',display:'flex',gap:16}}>
    <span>Zoom {(zoom*100).toFixed(0)}%</span><span>配置 {items.length}個</span><span>履歴 {(history[floor]||[]).length}</span>
    {saveStatus&&<span style={{color:'#4a8a4a'}}>✓ {saveStatus}</span>}
    <span style={{marginLeft:'auto'}}>(仮称)王子空ビル改修工事 | Scale 1:50</span>
  </div>
</div>

{/* ═══ Export: Pure SVG re-render on white bg ═══ */}
{showExport&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.92)',zIndex:9999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:16,overflow:'auto'}} onClick={()=>setShowExport(false)}>
  <div style={{background:'#fff',borderRadius:8,padding:8,maxWidth:'95vw',boxShadow:'0 8px 40px rgba(0,0,0,.7)'}} onClick={e=>e.stopPropagation()}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`-15 -15 ${vW} ${vH}`} style={{width:'85vw',maxHeight:'75vh',display:'block'}}>
      <rect x={-15} y={-15} width={vW} height={vH} fill="#ffffff"/>
      {/* Grid */}
      {Array.from({length:Math.ceil(fd.bw/10)+1}).map((_,i)=><line key={`ev${i}`} x1={i*10} y1={0} x2={i*10} y2={fd.bh} stroke="#e0e0e0" strokeWidth={.15}/>)}
      {Array.from({length:Math.ceil(fd.bh/10)+1}).map((_,i)=><line key={`eh${i}`} x1={0} y1={i*10} x2={fd.bw} y2={i*10} stroke="#e0e0e0" strokeWidth={.15}/>)}
      <DimLines dims={fd.dims} bw={fd.bw} bh={fd.bh}/>
      {/* All items with print-friendly colors */}
      {items.map(it=>{
        const pc=c=>{if(!c)return'#333';const d=c.replace('#','');const r=parseInt(d.substr(0,2),16);return r<100?'#444':c;};
        const rot=it.rot||0;const cx=it.x+it.w/2,cy=it.y+it.h/2;
        const rAttr=rot?{transform:`rotate(${rot},${cx},${cy})`}:{};
        if(it.type==='wall_outer'||it.type==='wall_inner')return <rect key={it.id} x={it.x} y={it.y} width={it.w} height={it.h} fill={it.type==='wall_outer'?'#333':'#555'} stroke={it.type==='wall_outer'?'#222':'#444'} strokeWidth={.12}/>;
        if(it.type==='column')return <g key={it.id}><rect x={it.x} y={it.y} width={it.w} height={it.h} fill="#ccc" stroke="#999" strokeWidth={.15}/><line x1={it.x} y1={it.y} x2={it.x+it.w} y2={it.y+it.h} stroke="#999" strokeWidth={.1}/><line x1={it.x+it.w} y1={it.y} x2={it.x} y2={it.y+it.h} stroke="#999" strokeWidth={.1}/></g>;
        if(it.type==='text')return <g key={it.id}><text x={it.x} y={it.y} textAnchor="middle" fill="#222" fontSize={it.fontSize||3} fontWeight={it.fontSize>=4?700:400} fontFamily="sans-serif">{it.label}</text>{it.sub&&<text x={it.x} y={it.y+3.2} textAnchor="middle" fill="#666" fontSize={2} fontFamily="sans-serif">{it.sub}</text>}</g>;
        if(it.type==='door')return <g key={it.id} {...rAttr}><line x1={it.x} y1={it.y+it.h} x2={it.x} y2={it.y} stroke="#444" strokeWidth={.4}/><path d={`M ${it.x} ${it.y} A ${it.w} ${it.w} 0 0 1 ${it.x+it.w} ${it.y+it.h}`} fill="none" stroke="#444" strokeWidth={.25} strokeDasharray="1,.5"/><line x1={it.x} y1={it.y+it.h} x2={it.x+it.w} y2={it.y+it.h} stroke="#444" strokeWidth={.3}/></g>;
        if(it.type==='window')return <g key={it.id} {...rAttr}><line x1={it.x} y1={it.y+it.h/2} x2={it.x+it.w} y2={it.y+it.h/2} stroke="#3388bb" strokeWidth={.6}/><line x1={it.x} y1={it.y} x2={it.x} y2={it.y+it.h} stroke="#3388bb" strokeWidth={.3}/><line x1={it.x+it.w} y1={it.y} x2={it.x+it.w} y2={it.y+it.h} stroke="#3388bb" strokeWidth={.3}/></g>;
        if(it.type==='sliding')return <g key={it.id} {...rAttr}><rect x={it.x} y={it.y} width={it.w*.55} height={it.h} fill="none" stroke="#444" strokeWidth={.25}/><rect x={it.x+it.w*.4} y={it.y} width={it.w*.6} height={it.h} fill="none" stroke="#444" strokeWidth={.25}/></g>;
        if(it.type==='stairs'){const steps=Math.round(it.h/2);return <g key={it.id} {...rAttr}><rect x={it.x} y={it.y} width={it.w} height={it.h} fill="#eee" stroke="#888" strokeWidth={.2}/>{Array.from({length:steps}).map((_,j)=><line key={j} x1={it.x} y1={it.y+j*(it.h/steps)} x2={it.x+it.w} y2={it.y+j*(it.h/steps)} stroke="#aaa" strokeWidth={.15}/>)}</g>;}
        if(!it.w)return null;
        {const isSwapped=rot===90||rot===270;
        const dispW=isSwapped?it.h:it.w, dispH=isSwapped?it.w:it.h;
        return <g key={it.id}>
          {rot?<g transform={`rotate(${rot},${cx},${cy})`}><ItemGfx x={cx-dispW/2} y={cy-dispH/2} w={dispW} h={dispH} type={it.type} color={pc(it.color)} stroke={pc(STROKE[it.type])}/></g>
               :<ItemGfx x={it.x} y={it.y} w={it.w} h={it.h} type={it.type} color={pc(it.color)} stroke={pc(STROKE[it.type])}/>}
          <text x={cx} y={cy+.6} textAnchor="middle" fill="#222" fontSize={Math.min(it.w,it.h)>5?2:1.4} fontFamily="sans-serif">{it.label}</text>
          {it.w>2&&it.h>2&&<text x={cx} y={cy+2.8} textAnchor="middle" fill="#888" fontSize={1.1} fontFamily="monospace">{Math.round(it.w*100)}×{Math.round(it.h*100)}</text>}
        </g>;}
      })}
      <line x1={0} y1={fd.bh+4} x2={10} y2={fd.bh+4} stroke="#888" strokeWidth={.25}/>
      <text x={5} y={fd.bh+7} textAnchor="middle" fill="#888" fontSize={1.8} fontFamily="monospace">1m</text>
      <text x={fd.bw/2} y={fd.bh+12} textAnchor="middle" fill="#444" fontSize={2.5} fontFamily="sans-serif" fontWeight="700">{fd.name} {fd.sub} — (仮称)王子空ビル改修工事</text>
    </svg>
  </div>
  <div style={{marginTop:12,textAlign:'center'}}>
    <div style={{fontSize:14,color:'#fff',fontWeight:700,marginBottom:6}}>⬇ 保存方法</div>
    <div style={{fontSize:13,color:'#dde',background:'rgba(30,30,50,.8)',padding:'10px 20px',borderRadius:8,marginBottom:10}}>
      <strong style={{color:'#8cf'}}>PC:</strong> 上の図面を<strong style={{color:'#e94560'}}>右クリック</strong> →「名前を付けて<strong>画像を保存</strong>」<br/>
      <strong style={{color:'#8cf'}}>スマホ:</strong> 上の図面を<strong style={{color:'#e94560'}}>長押し</strong> →「<strong>画像を保存</strong>」/ スクリーンショット
    </div>
    <button onClick={()=>setShowExport(false)} style={{padding:'10px 40px',background:'#e94560',color:'#fff',borderRadius:6,fontSize:14,border:'none',cursor:'pointer',fontFamily:'inherit',fontWeight:700}}>
      ✕ 閉じる
    </button>
  </div>
</div>}

</div>);
}

const inp={width:'100%',padding:'4px 6px',background:'#1a1d2e',border:'1px solid #2a2d3e',borderRadius:4,color:'#ccd',fontSize:12,outline:'none',fontFamily:'inherit',marginTop:2};
const tb={padding:'3px 10px',background:'#1e2030',border:'1px solid #2a2d3e',borderRadius:4,color:'#778',fontSize:10,cursor:'pointer',fontFamily:'inherit'};
const actBtn=(bg,c)=>({flex:1,padding:'5px',background:bg,border:'none',borderRadius:4,color:c,fontSize:10,cursor:'pointer',fontFamily:'inherit'});
