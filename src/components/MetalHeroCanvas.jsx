"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const MATERIALS = {
  Copper: { color: 0xc76a3a, emissive: 0x2b0802, accent: "#ff8c5a" },
  Brass: { color: 0xb28a32, emissive: 0x221703, accent: "#e3bd5b" },
  Aluminium: { color: 0xaeb8c2, emissive: 0x0d1218, accent: "#e0e9f2" },
  "Stainless Steel": { color: 0x8f9ca8, emissive: 0x0c1117, accent: "#c6d4df" },
};

export default function MetalHeroCanvas({ materialName, variants, fullBleed = false }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return undefined;

    const material = MATERIALS[materialName] || MATERIALS.Copper;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.position.x = fullBleed ? (window.innerWidth < 768 ? 0.65 : 1.55) : 0;
    scene.add(group);

    const metal = new THREE.MeshPhysicalMaterial({
      color: material.color,
      metalness: 0.96,
      roughness: 0.2,
      clearcoat: 0.65,
      clearcoatRoughness: 0.18,
      emissive: material.emissive,
      emissiveIntensity: 0.18,
    });
    const core = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.18, 0.3, 180, 28, 2, 3),
      metal,
    );
    core.rotation.set(0.3, -0.45, 0.15);
    group.add(core);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.62, 0.028, 12, 100),
      new THREE.MeshBasicMaterial({ color: material.color, transparent: true, opacity: 0.65 }),
    );
    ring.rotation.set(0.8, 0.35, 0);
    group.add(ring);

    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array((fullBleed ? 420 : 120) * 3);
    for (let index = 0; index < positions.length; index += 3) {
      positions[index] = (Math.random() - 0.5) * (fullBleed ? 14 : 6);
      positions[index + 1] = (Math.random() - 0.5) * (fullBleed ? 8 : 5);
      positions[index + 2] = (Math.random() - 0.5) * 2 - 1;
    }
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      particles,
      new THREE.PointsMaterial({ color: material.color, size: 0.025, transparent: true, opacity: 0.6 }),
    );
    scene.add(points);

    scene.add(new THREE.HemisphereLight(0xe8efff, 0x0c0d11, 1.8));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(4, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(material.color, 20, 9);
    rimLight.position.set(-3, -1, 3);
    scene.add(rimLight);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      const bounds = host.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    host.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = (time) => {
      const rotationSpeed = prefersReducedMotion ? 0 : time * 0.00022;
      group.rotation.y += (pointer.x * 0.48 - group.rotation.y) * 0.05;
      group.rotation.x += (-pointer.y * 0.28 - group.rotation.x) * 0.05;
      core.rotation.z = rotationSpeed;
      ring.rotation.z = -rotationSpeed * 0.8;
      points.rotation.y = rotationSpeed * 0.35;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((item) => item.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [fullBleed, materialName]);

  return (
    <div className={fullBleed ? "absolute inset-0" : "relative mx-auto h-[22rem] w-full max-w-xl sm:h-[30rem]"} aria-label={`${materialName} interactive 3D model`}>
      <div ref={canvasRef} className="absolute inset-0 touch-none" />
      {!fullBleed && <div className="pointer-events-none absolute right-2 top-[15%] border border-white/15 bg-[#17181d]/80 px-4 py-3 backdrop-blur-md sm:right-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: MATERIALS[materialName]?.accent || MATERIALS.Copper.accent }}>Material</span>
        <span className="mt-1 block text-sm font-semibold text-white">{materialName}</span>
      </div>}
      {!fullBleed && <div className="pointer-events-none absolute bottom-[12%] left-2 border border-white/15 bg-[#17181d]/80 px-4 py-3 backdrop-blur-md sm:left-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Available range</span>
        <span className="mt-1 block text-sm font-semibold text-white">{variants} variants</span>
      </div>}
    </div>
  );
}
