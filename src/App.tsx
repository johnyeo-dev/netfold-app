import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const SHAPES = [
  { id:"cube",        label:"Cube",               color:0x3b82f6, hex:"#3b82f6" },
  { id:"cuboid",      label:"Cuboid",             color:0xf97316, hex:"#f97316" },
  { id:"sqPyramid",   label:"Square Pyramid",     color:0x22c55e, hex:"#22c55e" },
  { id:"triPyramid",  label:"Triangular Pyramid", color:0xa855f7, hex:"#a855f7" },
  { id:"triPrism",    label:"Triangular Prism",   color:0xef4444, hex:"#ef4444" },
  { id:"cylinder",    label:"Cylinder",           color:0x14b8a6, hex:"#14b8a6" },
  { id:"cone",        label:"Cone",               color:0xeab308, hex:"#eab308" },
];

function triPrismGeo() {
  const geo = new THREE.BufferGeometry();
  const h=1.1, w=1.3, l=1.4;
  const v = new Float32Array([0,h,l, -w,-h,l, w,-h,l, 0,h,-l, -w,-h,-l, w,-h,-l]);
  geo.setAttribute("position", new THREE.BufferAttribute(v,3));
  geo.setIndex([0,1,2, 5,4,3, 0,3,4,0,4,1, 1,4,5,1,5,2, 2,5,3,2,3,0]);
  geo.computeVertexNormals();
  return geo;
}

function makeShape(id) {
  const col = SHAPES.find(s=>s.id===id)?.color || 0x3b82f6;
  const mat = new THREE.MeshPhongMaterial({color:col,transparent:true,opacity:0.88,side:THREE.DoubleSide,shininess:100});
  const eMat = new THREE.LineBasicMaterial({color:0x000000,transparent:true,opacity:0.3});
  let geo;
  if(id==="cube")       geo=new THREE.BoxGeometry(2,2,2);
  else if(id==="cuboid") geo=new THREE.BoxGeometry(3,1.5,2);
  else if(id==="sqPyramid") geo=new THREE.ConeGeometry(1.4,2.5,4);
  else if(id==="triPyramid") geo=new THREE.TetrahedronGeometry(1.8);
  else if(id==="triPrism") geo=triPrismGeo();
  else if(id==="cylinder") geo=new THREE.CylinderGeometry(1,1,2.5,32);
  else if(id==="cone") geo=new THREE.ConeGeometry(1.2,2.5,32);
  else geo=new THREE.BoxGeometry(2,2,2);
  const g=new THREE.Group();
  g.add(new THREE.Mesh(geo,mat));
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),eMat));
  return g;
}

// ── NET SVGs ──────────────────────────────────────────────
function NetSVG({id}:{id:string}) {
  const c = SHAPES.find(s=>s.id===id)?.hex||"#3b82f6";
  const sk="#1e293b", sw=2, lbl="#fff", fs=11;
  const Sq=({x,y,w,h,t,o=0.85})=>(
    <g><rect x={x} y={y} width={w} height={h} fill={c} stroke={sk} strokeWidth={sw} opacity={o} rx={2}/>
    <text x={x+w/2} y={y+h/2+4} textAnchor="middle" fontSize={fs} fill={lbl} fontWeight="bold">{t}</text></g>
  );
  const Tri=({pts,t,o=0.8})=>{
    const px=pts.map(([a,b])=>`${a},${b}`).join(" ");
    const cx=pts.reduce((s,[a])=>s+a,0)/pts.length, cy=pts.reduce((s,[,b])=>s+b,0)/pts.length;
    return(<g><polygon points={px} fill={c} stroke={sk} strokeWidth={sw} opacity={o}/>
    <text x={cx} y={cy+4} textAnchor="middle" fontSize={fs-1} fill={lbl} fontWeight="bold">{t}</text></g>);
  };
  if(id==="cube") return(
    <svg viewBox="0 0 270 360" width="100%" style={{maxHeight:300}}>
      <Sq x={90} y={10}  w={90} h={90} t="Top"/>
      <Sq x={0}  y={100} w={90} h={90} t="Left" o={0.72}/>
      <Sq x={90} y={100} w={90} h={90} t="Front"/>
      <Sq x={180} y={100} w={90} h={90} t="Right" o={0.72}/>
      <Sq x={90} y={190} w={90} h={90} t="Bottom"/>
      <Sq x={90} y={280} w={90} h={90} t="Back" o={0.62}/>
    </svg>);
  if(id==="cuboid") return(
    <svg viewBox="0 0 430 260" width="100%" style={{maxHeight:280}}>
      <Sq x={115} y={5}  w={140} h={60} t="Top"/>
      <Sq x={0}   y={65} w={60}  h={100} t="Left" o={0.72}/>
      <Sq x={60}  y={65} w={140} h={100} t="Front"/>
      <Sq x={200} y={65} w={60}  h={100} t="Right" o={0.72}/>
      <Sq x={260} y={65} w={140} h={100} t="Back" o={0.62}/>
      <Sq x={60}  y={165} w={140} h={60} t="Bottom"/>
    </svg>);
  if(id==="sqPyramid") return(
    <svg viewBox="0 0 320 320" width="100%" style={{maxHeight:300}}>
      <Sq x={110} y={110} w={100} h={100} t="Base"/>
      <Tri pts={[[110,110],[160,20],[210,110]]} t="Side"/>
      <Tri pts={[[110,210],[160,300],[210,210]]} t="Side"/>
      <Tri pts={[[110,110],[20,160],[110,210]]} t="Side"/>
      <Tri pts={[[210,110],[300,160],[210,210]]} t="Side"/>
    </svg>);
  if(id==="triPyramid") return(
    <svg viewBox="0 0 340 60" width="100%" style={{maxHeight:120}}>
      {[0,1,2,3].map(i=>i%2===0
        ? <Tri key={i} pts={[[10+i*80,55],[50+i*80,5],[90+i*80,55]]} t="Face" o={0.8+i*0.02}/>
        : <Tri key={i} pts={[[10+i*80,5],[50+i*80,55],[90+i*80,5]]} t="Face" o={0.75}/>
      )}
    </svg>);
  if(id==="triPrism") return(
    <svg viewBox="0 0 380 260" width="100%" style={{maxHeight:260}}>
      <Tri pts={[[10,90],[70,10],[10,170]]} t="△" o={0.78}/>
      <Sq x={70}  y={90} w={100} h={80} t="Base"/>
      <Sq x={170} y={90} w={100} h={80} t="Front"/>
      <Sq x={270} y={90} w={100} h={80} t="Back" o={0.72}/>
      <Sq x={70}  y={10} w={100} h={80} t="Top" o={0.78}/>
      <Tri pts={[[170,90],[230,10],[170,170]]} t="△" o={0.78}/>
    </svg>);
  if(id==="cylinder") return(
    <svg viewBox="0 0 310 270" width="100%" style={{maxHeight:260}}>
      <ellipse cx={155} cy={52} rx={60} ry={42} fill={c} stroke={sk} strokeWidth={sw} opacity={0.85}/>
      <text x={155} y={57} textAnchor="middle" fontSize={fs} fill={lbl} fontWeight="bold">Top</text>
      <Sq x={20} y={105} w={270} h={100} t="Curved Body (roll up)"/>
      <line x1={20} y1={105} x2={20} y2={205} stroke="#888" strokeWidth={1} strokeDasharray="5,3"/>
      <line x1={290} y1={105} x2={290} y2={205} stroke="#888" strokeWidth={1} strokeDasharray="5,3"/>
      <ellipse cx={155} cy={225} rx={60} ry={36} fill={c} stroke={sk} strokeWidth={sw} opacity={0.8}/>
      <text x={155} y={230} textAnchor="middle" fontSize={fs} fill={lbl} fontWeight="bold">Bottom</text>
    </svg>);
  if(id==="cone") return(
    <svg viewBox="0 0 300 270" width="100%" style={{maxHeight:270}}>
      <path d="M150,15 L28,215 Q150,275 272,215 Z" fill={c} stroke={sk} strokeWidth={sw} opacity={0.85}/>
      <text x={150} y={140} textAnchor="middle" fontSize={fs} fill={lbl} fontWeight="bold">Lateral Surface (sector)</text>
      <ellipse cx={150} cy={228} rx={56} ry={33} fill={c} stroke={sk} strokeWidth={sw} opacity={0.8}/>
      <text x={150} y={233} textAnchor="middle" fontSize={fs} fill={lbl} fontWeight="bold">Base</text>
    </svg>);
  return null;
}

// ── QUIZ SVG NETS ──────────────────────────────────────────
function GridNet({cells,color}:{cells:number[][],color:string}) {
  if(!cells||cells.length===0) return null;
  const sz=30, mx=Math.min(...cells.map(([x])=>x)), my=Math.min(...cells.map(([,y])=>y));
  const W=(Math.max(...cells.map(([x])=>x))-mx+1)*sz+16, H=(Math.max(...cells.map(([,y])=>y))-my+1)*sz+16;
  return(<svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
    {cells.map(([x,y],i)=><rect key={i} x={(x-mx)*sz+8} y={(y-my)*sz+8} width={sz-2} height={sz-2} fill={color} stroke="#1e293b" strokeWidth={1.5} rx={2} opacity={0.85}/>)}
  </svg>);
}

function PyramidNet({valid,color:c}:{valid:boolean,color:string}) {
  const sk="#1e293b";
  if(valid) return(<svg viewBox="0 0 120 120" width="100%" height="100%">
    <rect x={35} y={35} width={50} height={50} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.9}/>
    <polygon points="35,35 60,8 85,35" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.75}/>
    <polygon points="35,85 60,112 85,85" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.75}/>
    <polygon points="35,35 8,60 35,85" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.75}/>
    <polygon points="85,35 112,60 85,85" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.75}/>
  </svg>);
  return(<svg viewBox="0 0 150 65" width="100%" height="100%">
    <rect x={55} y={15} width={45} height={45} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.9}/>
    <polygon points="10,55 27,10 44,55" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.75}/>
    <polygon points="100,55 117,10 134,55" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.75}/>
    <polygon points="10,55 27,10 44,55" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.75}/>
  </svg>);
}

function TetraNet({valid,color:c}:{valid:boolean,color:string}) {
  const sk="#1e293b";
  if(valid) return(<svg viewBox="0 0 310 60" width="100%" height="100%">
    {[0,1,2,3].map(i=>i%2===0
      ? <polygon key={i} points={`${10+i*72},55 ${46+i*72},5 ${82+i*72},55`} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.82}/>
      : <polygon key={i} points={`${10+i*72},5 ${46+i*72},55 ${82+i*72},5`} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.82}/>
    )}
  </svg>);
  return(<svg viewBox="0 0 250 65" width="100%" height="100%">
    {[0,1,2].map(i=><polygon key={i} points={`${10+i*76},55 ${48+i*76},5 ${86+i*76},55`} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.82}/>)}
    <polygon points="10,5 48,55 86,5" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.82}/>
  </svg>);
}

function CylNet({valid,color:c}:{valid:boolean,color:string}) {
  const sk="#1e293b";
  if(valid) return(<svg viewBox="0 0 150 90" width="100%" height="100%">
    <ellipse cx={25} cy={45} rx={18} ry={30} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.8}/>
    <rect x={43} y={12} width={80} height={66} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.87}/>
    <ellipse cx={140} cy={45} rx={18} ry={30} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.8}/>
  </svg>);
  return(<svg viewBox="0 0 120 80" width="100%" height="100%">
    <ellipse cx={25} cy={40} rx={18} ry={26} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.8}/>
    <rect x={43} y={14} width={70} height={52} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.87}/>
  </svg>);
}

function ConeNet({valid,color:c}:{valid:boolean,color:string}) {
  const sk="#1e293b";
  if(valid) return(<svg viewBox="0 0 120 105" width="100%" height="100%">
    <path d="M60,8 L12,82 Q60,102 108,82 Z" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.85}/>
    <ellipse cx={60} cy={85} rx={34} ry={16} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.8}/>
  </svg>);
  return(<svg viewBox="0 0 120 100" width="100%" height="100%">
    <polygon points="60,8 10,90 110,90" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.85}/>
    <rect x={10} y={88} width={100} height={10} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.8}/>
  </svg>);
}

function PrismNet({valid,color:c}:{valid:boolean,color:string}) {
  const sk="#1e293b";
  if(valid) return(<svg viewBox="0 0 300 105" width="100%" height="100%">
    <polygon points="10,95 35,10 10,95" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.8}/>
    <rect x={10} y={30} width={70} height={65} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.87}/>
    <rect x={80} y={30} width={70} height={65} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.87}/>
    <rect x={150} y={30} width={70} height={65} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.87}/>
    <polygon points="10,30 35,5 60,30" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.8}/>
    <polygon points="80,30 105,5 130,30" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.8}/>
    <rect x={220} y={30} width={70} height={65} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.75}/>
  </svg>);
  return(<svg viewBox="0 0 280 80" width="100%" height="100%">
    {[0,1,2,3].map(i=><rect key={i} x={10+i*65} y={15} width={60} height={55} fill={c} stroke={sk} strokeWidth={1.5} opacity={0.85}/>)}
    <polygon points="10,15 40,5 10,40" fill={c} stroke={sk} strokeWidth={1.5} opacity={0.78}/>
  </svg>);
}

const QUIZ = {
  cube:{q:"Which net folds into a Cube?",nets:[
    {valid:true, cells:[[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]]},
    {valid:false,cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]},
    {valid:true, cells:[[0,0],[1,0],[1,1],[1,2],[2,2],[1,3]]},
    {valid:false,cells:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]]},
  ]},
  cuboid:{q:"Which net folds into a Cuboid?",nets:[
    {valid:true, cells:[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]]},
    {valid:false,cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]},
    {valid:true, cells:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2]]},
    {valid:false,cells:[[0,0],[1,0],[0,1],[1,1],[0,2],[1,2]]},
  ]},
  sqPyramid:{q:"Which net folds into a Square Pyramid?",component:"pyramid"},
  triPyramid:{q:"Which net folds into a Triangular Pyramid?",component:"tetra"},
  triPrism:{q:"Which net folds into a Triangular Prism?",component:"prism"},
  cylinder:{q:"Which net folds into a Cylinder?",component:"cylinder"},
  cone:{q:"Which net folds into a Cone?",component:"cone"},
};

const COMPONENT_NETS = {
  pyramid:[true,false,true,false],
  tetra:[true,false,true,false],
  prism:[true,false,true,false],
  cylinder:[true,false,true,false],
  cone:[true,false,true,false],
};

function QuizNetItem({shapeId, net, type, idx, color}:{shapeId:string, net?:any, type?:string, idx:number, color:string}) {
  if(type==="pyramid") return <PyramidNet valid={COMPONENT_NETS.pyramid[idx]} color={color}/>;
  if(type==="tetra")   return <TetraNet   valid={COMPONENT_NETS.tetra[idx]}   color={color}/>;
  if(type==="prism")   return <PrismNet   valid={COMPONENT_NETS.prism[idx]}   color={color}/>;
  if(type==="cylinder")return <CylNet     valid={COMPONENT_NETS.cylinder[idx]}color={color}/>;
  if(type==="cone")    return <ConeNet    valid={COMPONENT_NETS.cone[idx]}    color={color}/>;
  return <GridNet cells={net?.cells} color={color}/>;
}

// ── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const mountRef=useRef(null), rendRef=useRef(null), sceneRef=useRef(null),
    camRef=useRef(null), groupRef=useRef(null), rafRef=useRef(null);
  const drag=useRef({on:false,x:0,y:0}), autoRot=useRef(true);
  const [shapeId,setShapeId]=useState("cube");
  const [tab,setTab]=useState("3d");
  const [qSel,setQSel]=useState<number | null>(null);
  const [qReveal,setQReveal]=useState(false);
  const [showLabels,setShowLabels]=useState(true);
  const shape=SHAPES.find(s=>s.id===shapeId);

  useEffect(()=>{
    const el=mountRef.current; if(!el) return;
    const W=el.clientWidth||400, H=el.clientHeight||500;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    el.appendChild(renderer.domElement); rendRef.current=renderer;
    const scene=new THREE.Scene();
    scene.background=new THREE.Color(0x0f172a);
    sceneRef.current=scene;
    const cam=new THREE.PerspectiveCamera(45,W/H,0.1,100);
    cam.position.set(0,1.5,7); camRef.current=cam;
    scene.add(new THREE.AmbientLight(0xffffff,0.5));
    const dl=new THREE.DirectionalLight(0xffffff,1); dl.position.set(6,10,8); scene.add(dl);
    const dl2=new THREE.DirectionalLight(0x88ccff,0.3); dl2.position.set(-5,-3,-5); scene.add(dl2);
    const grid=new THREE.GridHelper(14,14,0x1e3a5f,0x1e293b); grid.position.y=-2.5; scene.add(grid);
    const g=makeShape("cube"); scene.add(g); groupRef.current=g;
    const onResize=()=>{
      const newW=el.clientWidth||400, newH=el.clientHeight||500;
      renderer.setSize(newW,newH);
      cam.aspect=newW/newH;
      cam.updateProjectionMatrix();
    };
    const tick=()=>{ rafRef.current=requestAnimationFrame(tick);
      if(autoRot.current&&groupRef.current) groupRef.current.rotation.y+=0.007;
      renderer.render(scene,cam); };
    tick();
    const onMD=e=>{drag.current={on:true,x:e.clientX,y:e.clientY};autoRot.current=false;};
    const onMM=e=>{ if(!drag.current.on||!groupRef.current)return;
      groupRef.current.rotation.y+=(e.clientX-drag.current.x)*0.012;
      groupRef.current.rotation.x+=(e.clientY-drag.current.y)*0.012;
      drag.current={...drag.current,x:e.clientX,y:e.clientY};};
    const onMU=()=>drag.current.on=false;
    const onW=e=>{e.preventDefault();if(camRef.current)camRef.current.position.z=Math.max(2.5,Math.min(14,camRef.current.position.z+e.deltaY*0.012));};
    let lt=null;
    const onTS=e=>{lt=e.touches[0];autoRot.current=false;};
    const onTM=e=>{ if(!lt||!groupRef.current)return; const t=e.touches[0];
      groupRef.current.rotation.y+=(t.clientX-lt.clientX)*0.012;
      groupRef.current.rotation.x+=(t.clientY-lt.clientY)*0.012; lt=t;};
    el.addEventListener("mousedown",onMD); window.addEventListener("mousemove",onMM);
    window.addEventListener("mouseup",onMU); window.addEventListener("resize",onResize); el.addEventListener("wheel",onW,{passive:false});
    el.addEventListener("touchstart",onTS,{passive:true}); el.addEventListener("touchmove",onTM,{passive:true});
    return()=>{ cancelAnimationFrame(rafRef.current);
      el.removeEventListener("mousedown",onMD); window.removeEventListener("mousemove",onMM);
      window.removeEventListener("mouseup",onMU); window.removeEventListener("resize",onResize); el.removeEventListener("wheel",onW);
      el.removeEventListener("touchstart",onTS); el.removeEventListener("touchmove",onTM);
      renderer.dispose(); if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);};
  },[]);

  useEffect(()=>{
    const sc=sceneRef.current; if(!sc) return;
    if(groupRef.current){sc.remove(groupRef.current);groupRef.current=null;}
    const g=makeShape(shapeId); sc.add(g); groupRef.current=g; autoRot.current=true;
    setQSel(null); setQReveal(false);
  },[shapeId]);

  const rotL=()=>{if(groupRef.current)groupRef.current.rotation.y-=0.4;autoRot.current=false;};
  const rotR=()=>{if(groupRef.current)groupRef.current.rotation.y+=0.4;autoRot.current=false;};
  const zIn=()=>{if(camRef.current)camRef.current.position.z=Math.max(2.5,camRef.current.position.z-0.8);};
  const zOut=()=>{if(camRef.current)camRef.current.position.z=Math.min(14,camRef.current.position.z+0.8);};
  const reset=()=>{if(groupRef.current)groupRef.current.rotation.set(0,0,0);
    if(camRef.current)camRef.current.position.set(0,1.5,7);autoRot.current=true;};

  const quiz=QUIZ[shapeId]||QUIZ.cube;
  const compType=quiz.component;
  const nets=compType ? [{},{},{},{}] : quiz.nets;
  const isNetValid=(i)=> compType ? COMPONENT_NETS[compType][i] : nets[i]?.valid;

  const Btn=({active,label,onClick,accent}:{active:boolean,label:string,onClick:()=>void,accent?:string})=>(
    <button onClick={onClick} style={{padding:"6px 13px",borderRadius:20,border:`2px solid ${active?(accent||"#3b82f6"):"transparent"}`,
      background:active?(accent||"#3b82f6"):"#1e293b",color:"#fff",cursor:"pointer",fontSize:12,
      fontWeight:active?"bold":"normal",transition:"all 0.15s",whiteSpace:"nowrap"}}>{label}</button>);
  const CtrlBtn=({label,onClick}:{label:string,onClick:()=>void})=>(
    <button onClick={onClick} style={{padding:"7px 12px",borderRadius:16,border:"none",
      background:"#1e293b",color:"#94a3b8",cursor:"pointer",fontSize:13}}>{label}</button>);

  return(
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",height:"100vh",background:"#0f172a",color:"#f1f5f9"}}>
      {/* Header */}
      <div style={{padding:"9px 16px",background:"#020617",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #1e293b"}}>
        <span style={{fontSize:22}}>🔷</span>
        <div><div style={{fontWeight:"bold",fontSize:15,lineHeight:1}}>NetFold</div>
        <div style={{fontSize:10,color:"#64748b"}}>PSLE Maths · 3D Nets Explorer</div></div>
      </div>
      {/* Shape selector */}
      <div style={{overflowX:"auto",padding:"7px 10px",background:"#020617",display:"flex",gap:6,borderBottom:"1px solid #1e293b"}}>
        {SHAPES.map(s=><Btn key={s.id} active={shapeId===s.id} label={s.label} onClick={()=>setShapeId(s.id)} accent={s.hex}/>)}
      </div>
      {/* View tabs */}
      <div style={{display:"flex",justifyContent:"center",gap:10,padding:"7px 12px",background:"#020617",borderBottom:"1px solid #1e293b"}}>
        {[["3d","🔮 3D View"],["net","📄 Net"],["quiz","🧠 Quiz"]].map(([t,l])=>(
          <Btn key={t} active={tab===t} label={l} onClick={()=>setTab(t)}/>))}
      </div>
      {/* Main */}
      <div style={{flex:1,overflow:"hidden",position:"relative"}}>
        <div ref={mountRef} style={{width:"100%",height:"100%",display:tab==="3d"?"block":"none",cursor:"grab"}}/>
        {tab==="net"&&(
          <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#f8fafc",padding:20,overflowY:"auto"}}>
            <h3 style={{color:"#1e293b",margin:"0 0 4px",fontSize:17}}>Net of the {shape?.label}</h3>
            <p style={{color:"#64748b",fontSize:12,margin:"0 0 14px",textAlign:"center"}}>Unfold the {shape?.label} flat — each face becomes a 2D shape</p>
            <div style={{maxWidth:440,width:"100%",padding:20,background:"#fff",borderRadius:16,boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}>
              <NetSVG id={shapeId}/>
            </div>
            <div style={{marginTop:12,padding:"10px 16px",background:"#eff6ff",borderRadius:12,maxWidth:440,width:"100%"}}>
              <p style={{color:"#1d4ed8",fontSize:12,margin:0,textAlign:"center"}}>💡 Each coloured panel folds up to form one face of the {shape?.label}</p>
            </div>
          </div>
        )}
        {tab==="quiz"&&(
          <div style={{height:"100%",overflowY:"auto",padding:16}}>
            <h3 style={{textAlign:"center",color:"#fbbf24",margin:"0 0 4px",fontSize:15}}>{quiz.q}</h3>
            <p style={{textAlign:"center",color:"#94a3b8",fontSize:12,margin:"0 0 12px"}}>Tap your answer → press <strong style={{color:"#fbbf24"}}>Check</strong></p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:480,margin:"0 auto"}}>
              {[0,1,2,3].map(i=>{
                const valid=isNetValid(i);
                const sel=qSel===i;
                const bc=qReveal?(valid?"#22c55e":"#ef4444"):(sel?"#fbbf24":"#334155");
                const bg=qReveal?(valid?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.08)"):(sel?"rgba(251,191,36,0.1)":"#1e293b");
                return(<div key={i} onClick={()=>!qReveal&&setQSel(i)} style={{border:`2.5px solid ${bc}`,borderRadius:12,padding:"10px 10px 8px",cursor:qReveal?"default":"pointer",background:bg,transition:"all 0.2s",minHeight:120}}>
                  <div style={{fontWeight:"bold",fontSize:13,marginBottom:6,color:"#f1f5f9"}}>Option {String.fromCharCode(65+i)}</div>
                  <div style={{height:80,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <QuizNetItem shapeId={shapeId} net={nets[i]} type={compType} idx={i} color={shape?.hex}/>
                  </div>
                  {qReveal&&<div style={{marginTop:6,fontSize:11,fontWeight:"bold",color:valid?"#4ade80":"#f87171"}}>{valid?"✅ Valid net":"❌ Cannot fold"}</div>}
                </div>);
              })}
            </div>
            <div style={{textAlign:"center",marginTop:14,minHeight:60}}>
              {!qReveal
                ?<button onClick={()=>{if(qSel!==null)setQReveal(true);}} style={{padding:"10px 28px",borderRadius:24,border:"none",fontSize:14,fontWeight:"bold",background:qSel!==null?"#fbbf24":"#334155",color:qSel!==null?"#000":"#64748b",cursor:qSel!==null?"pointer":"not-allowed",transition:"all 0.2s"}}>Check Answer ✓</button>
                :<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                  <div style={{fontSize:15,fontWeight:"bold",color:isNetValid(qSel)?"#4ade80":"#f87171"}}>{isNetValid(qSel)?"🎉 Correct! Well done!":"💡 Not quite — try again!"}</div>
                  <button onClick={()=>{setQSel(null);setQReveal(false);}} style={{padding:"8px 24px",borderRadius:24,border:"none",background:"#3b82f6",color:"#fff",fontWeight:"bold",cursor:"pointer",fontSize:13}}>Try Again</button>
                </div>}
            </div>
          </div>
        )}
      </div>
      {/* Controls */}
      {tab==="3d"&&(
        <div style={{display:"flex",justifyContent:"center",gap:7,padding:"10px 14px",background:"#020617",flexWrap:"wrap",borderTop:"1px solid #1e293b"}}>
          <CtrlBtn label="◀ Rotate" onClick={rotL}/>
          <CtrlBtn label="🔍 +" onClick={zIn}/>
          <CtrlBtn label="↺ Reset" onClick={reset}/>
          <CtrlBtn label="🔍 −" onClick={zOut}/>
          <CtrlBtn label="Rotate ▶" onClick={rotR}/>
          <button onClick={()=>autoRot.current=!autoRot.current} style={{padding:"7px 12px",borderRadius:16,border:"none",background:"#1e293b",color:"#94a3b8",cursor:"pointer",fontSize:12}}>⏸ Auto-spin</button>
          <button onClick={()=>setShowLabels(v=>!v)} style={{padding:"7px 12px",borderRadius:16,border:"none",background:"#1e293b",color:"#94a3b8",cursor:"pointer",fontSize:12}}>{showLabels?"🏷 Hide Labels":"🏷 Show Labels"}</button>
        </div>
      )}
    </div>
  );
}
