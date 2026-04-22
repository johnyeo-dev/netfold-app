import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const SHAPES = [
  { id: "cube", label: "Cube", color: 0x3b82f6 },
  { id: "cuboid", label: "Cuboid", color: 0xf97316 },
  { id: "sqPyramid", label: "Square Pyramid", color: 0x22c55e },
  { id: "triPyramid", label: "Triangular Pyramid", color: 0xa855f7 },
  { id: "triPrism", label: "Triangular Prism", color: 0xef4444 },
  { id: "cylinder", label: "Cylinder", color: 0x14b8a6 },
  { id: "cone", label: "Cone", color: 0xeab308 },
];

function makeShape(id: string) {
  let geo: THREE.BufferGeometry;

  if (id === "cube") geo = new THREE.BoxGeometry(2, 2, 2);
  else if (id === "cuboid") geo = new THREE.BoxGeometry(3, 1.5, 2);
  else if (id === "sqPyramid") geo = new THREE.ConeGeometry(1.4, 2.5, 4);
  else if (id === "triPyramid") geo = new THREE.TetrahedronGeometry(1.8);
  else if (id === "cylinder") geo = new THREE.CylinderGeometry(1, 1, 2.5, 32);
  else if (id === "cone") geo = new THREE.ConeGeometry(1.2, 2.5, 32);
  else geo = new THREE.BoxGeometry(2, 2, 2);

  const material = new THREE.MeshPhongMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.9,
  });

  return new THREE.Mesh(geo, material);
}

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const shapeRef = useRef<THREE.Mesh | null>(null);

  const [shapeId, setShapeId] = useState("cube");
  const [tab, setTab] = useState<"3d" | "net" | "quiz">("3d");
  const [autoSpin, setAutoSpin] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const shape = makeShape(shapeId);
    shapeRef.current = shape;
    scene.add(shape);

    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (autoSpin && shapeRef.current) {
        shapeRef.current.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      renderer.dispose();
    };
  }, [shapeId, autoSpin]);

  const rotateLeft = () => {
    if (shapeRef.current) shapeRef.current.rotation.y -= 0.4;
  };

  const rotateRight = () => {
    if (shapeRef.current) shapeRef.current.rotation.y += 0.4;
  };

  const reset = () => {
    if (shapeRef.current) shapeRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div style={{ height: "100vh", background: "#0f172a", color: "white", display: "flex", flexDirection: "column" }}>
      
      {/* HEADER */}
      <div style={{ padding: 10, borderBottom: "1px solid #1e293b" }}>
        <h2 style={{ margin: 0 }}>🔷 NetFold</h2>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          PSLE Maths · 3D Nets Explorer
        </div>
      </div>

      {/* SHAPE SELECTOR */}
      <div style={{ padding: 10 }}>
        {SHAPES.map((s) => (
          <button
            key={s.id}
            onClick={() => setShapeId(s.id)}
            style={{
              marginRight: 8,
              padding: "6px 10px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: shapeId === s.id ? "#3b82f6" : "#1e293b",
              color: "white",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* TABS */}
      <div style={{ padding: 10 }}>
        <button onClick={() => setTab("3d")} style={{ marginRight: 8 }}>
          🔮 3D View
        </button>
        <button onClick={() => setTab("net")} style={{ marginRight: 8 }}>
          📄 Net
        </button>
        <button onClick={() => setTab("quiz")}>
          🧠 Quiz
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, position: "relative" }}>
        {tab === "3d" && (
          <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
        )}

        {tab === "net" && (
          <div style={{ padding: 20 }}>
            <h3>Net of {shapeId}</h3>
            <p>This is where your net visualization will go.</p>
          </div>
        )}

        {tab === "quiz" && (
          <div style={{ padding: 20 }}>
            <h3>Quiz Mode</h3>
            <p>Which net forms a {shapeId}?</p>
            <p>(Quiz UI placeholder)</p>
          </div>
        )}
      </div>

      {/* CONTROLS */}
      {tab === "3d" && (
        <div style={{ padding: 10, display: "flex", justifyContent: "center", gap: 10 }}>
          <button onClick={rotateLeft}>◀ Rotate</button>
          <button onClick={reset}>Reset</button>
          <button onClick={rotateRight}>Rotate ▶</button>
          <button onClick={() => setAutoSpin(!autoSpin)}>
            {autoSpin ? "Pause Spin" : "Auto Spin"}
          </button>
        </div>
      )}
    </div>
  );
}
