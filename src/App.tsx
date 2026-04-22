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
  const [shapeId, setShapeId] = useState("cube");

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
    mount.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const shape = makeShape(shapeId);
    scene.add(shape);

    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      shape.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [shapeId]);

  return (
    <div style={{ height: "100vh", background: "#0f172a", color: "white" }}>
      <div style={{ padding: 10 }}>
        {SHAPES.map((s) => (
          <button
            key={s.id}
            onClick={() => setShapeId(s.id)}
            style={{
              marginRight: 8,
              marginBottom: 8,
              padding: "6px 10px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div ref={mountRef} style={{ width: "100%", height: "90%" }} />
    </div>
  );
}
