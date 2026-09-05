"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { approachAngle, frameDelta, wrapAngle } from "./heroMotion.mjs";

const FINISHES = [
  { color: 0xc78051, roughness: 0.27, metalness: 0.96 },
  { color: 0xc4a256, roughness: 0.3, metalness: 0.94 },
  { color: 0xb9c5c9, roughness: 0.37, metalness: 0.9 },
  { color: 0x899da8, roughness: 0.22, metalness: 0.98 },
];

// A rolled sheet: an Archimedean spiral unwinds into a tangent tail.
function rolledSheet(width, phase) {
  const steps = 260;
  const positions = [];
  const uvs = [];
  const indices = [];
  const turns = Math.PI * 4.7;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = Math.min(t / 0.84, 1) * turns;
    const radius = 0.55 + theta * 0.043;
    let x = Math.cos(theta + phase) * radius;
    let y = Math.sin(theta + phase) * radius;
    if (t > 0.84) {
      const tail = (t - 0.84) / 0.16;
      const angle = turns + phase;
      x += (-Math.sin(angle) * 3.4 + Math.cos(angle) * 0.1) * tail;
      y += Math.cos(angle) * 3.4 * tail - tail * tail * 0.35;
    }
    for (let side = 0; side < 2; side++) {
      positions.push(x, y, (side - 0.5) * width);
      uvs.push(t * 6, side);
    }
    if (i < steps) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export default function HomeMetalScene({ surfaceRef, selected, expanded, paused, resetKey, onStatus }) {
  const hostRef = useRef(null);
  const controls = useRef({ selected, expanded, paused, resetKey });
  useEffect(() => { controls.current = { selected, expanded, paused, resetKey }; }, [selected, expanded, paused, resetKey]);

  useEffect(() => {
    const host = hostRef.current;
    const surface = surfaceRef.current;
    if (!host || !surface) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      onStatus("unavailable");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(0, 1.3, 15);
    camera.lookAt(0, 0, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.02);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();

    // Deterministic micro-grooves create a directional brushed finish.
    const grainData = new Uint8Array(128 * 128 * 4);
    for (let y = 0; y < 128; y++) {
      for (let x = 0; x < 128; x++) {
        const offset = (y * 128 + x) * 4;
        const value = 140 + Math.round(Math.sin(y * 13.7) * 18 + Math.sin(y * 3.1 + x * 0.03) * 9);
        grainData[offset] = grainData[offset + 1] = grainData[offset + 2] = value;
        grainData[offset + 3] = 255;
      }
    }
    const grain = new THREE.DataTexture(grainData, 128, 128);
    grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
    grain.repeat.set(3, 5);
    grain.needsUpdate = true;
    const assembly = new THREE.Group();
    scene.add(assembly);
    const sheets = [];
    for (let i = 0; i < 3; i++) {
      const material = new THREE.MeshStandardMaterial({ ...FINISHES[0], side: THREE.DoubleSide, bumpMap: grain, bumpScale: 0.009, envMapIntensity: 1.5 });
      const geometry = rolledSheet(1.05, -0.9);
      const sheet = new THREE.Mesh(geometry, material);
      sheet.position.z = (i - 1) * 1.13;
      sheet.position.y = (i - 1) * 0.07;
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 25), new THREE.LineBasicMaterial({ color: 0xe9c9a3, transparent: true, opacity: 0.28 }));
      sheet.add(edge);
      assembly.add(sheet);
      sheets.push(sheet);
    }
    assembly.rotation.set(0.32, -0.58, -0.25);
    const restBounds = new THREE.Box3().setFromObject(assembly);
    const restCenter = restBounds.getCenter(new THREE.Vector3());
    const restSize = restBounds.getSize(new THREE.Vector3());

    const key = new THREE.DirectionalLight(0xffe1bd, 3.2);
    key.position.set(-3, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd2e6ed, 3.5);
    rim.position.set(4, 2, -4);
    scene.add(rim);
    const cursorLight = new THREE.PointLight(0xffe7ca, 35, 18, 2);
    cursorLight.position.set(3, 3, 6);
    scene.add(cursorLight);

    let mobile = false;
    let frame = 0;
    let previousTime = null;
    let elapsed = 0;
    let visible = true;
    let contextLost = false;
    let activePointerId = null;
    let captureTarget = null;
    let dragX = 0;
    let dragY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastReset = controls.current.resetKey;
    const pointer = new THREE.Vector2();
    const smoothPointer = new THREE.Vector2();
    const targetColor = new THREE.Color();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    function render(time) {
      frame = 0;
      if (!visible || document.hidden || contextLost) return;
      const delta = frameDelta(time, previousTime);
      previousTime = time;
      const state = controls.current;
      const motionEnabled = !reducedMotion && !state.paused;
      if (motionEnabled) elapsed += delta;
      if (lastReset !== state.resetKey) {
        endDrag();
        dragX = dragY = 0;
        pointer.set(0, 0);
        smoothPointer.set(0, 0);
        lastReset = state.resetKey;
      }
      const ease = reducedMotion ? 1 : 1 - Math.exp(-delta * 5);
      smoothPointer.lerp(pointer, ease);
      const turn = motionEnabled ? smoothPointer.x * 0.15 + Math.sin(elapsed * 0.22) * 0.06 : 0;
      const targetY = -0.58 + dragX + turn;
      const targetX = 0.32 + dragY + (motionEnabled ? smoothPointer.y * 0.09 : 0);
      const targetZ = -0.25 + (motionEnabled ? Math.sin(elapsed * 0.3) * 0.025 : 0);
      assembly.rotation.y = reducedMotion ? wrapAngle(targetY) : approachAngle(assembly.rotation.y, targetY, delta);
      assembly.rotation.x = reducedMotion ? targetX : approachAngle(assembly.rotation.x, targetX, delta);
      assembly.rotation.z = reducedMotion ? targetZ : approachAngle(assembly.rotation.z, targetZ, delta);
      const finish = FINISHES[state.selected];
      targetColor.setHex(finish.color);
      sheets.forEach((sheet, i) => {
        const spacing = state.expanded ? 1.95 : 1.13;
        sheet.position.z = THREE.MathUtils.lerp(sheet.position.z, (i - 1) * spacing, ease);
        sheet.material.color.lerp(targetColor, ease);
        sheet.material.roughness = THREE.MathUtils.lerp(sheet.material.roughness, finish.roughness, ease);
        sheet.material.metalness = finish.metalness;
      });
      cursorLight.position.x = (mobile ? 0 : 3) + smoothPointer.x * 4;
      cursorLight.position.y = 3 + smoothPointer.y * 3;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    }
    function invalidate() {
      if (!frame && visible && !document.hidden && !contextLost) {
        previousTime = null;
        frame = requestAnimationFrame(render);
      }
    }
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const { width, height } = bounds;
      if (!width || !height) return;
      mobile = width < 1024 || window.innerHeight < 650;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.set(0, 0, 15);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      const stage = surface.querySelector("[data-metal-stage]").getBoundingClientRect();
      const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const unitsPerPixel = viewHeight / height;
      const scale = Math.min(stage.width * unitsPerPixel / (restSize.x * 1.08), stage.height * unitsPerPixel / (restSize.y * 1.08));
      assembly.scale.setScalar(scale);
      assembly.position.set(
        (stage.left - bounds.left + stage.width / 2 - width / 2) * unitsPerPixel - restCenter.x * scale,
        (height / 2 - (stage.top - bounds.top + stage.height / 2)) * unitsPerPixel - restCenter.y * scale,
        0,
      );
      invalidate();
    };
    const move = (event) => {
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      const bounds = surface.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer.set(
        THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, -1, 1),
        THREE.MathUtils.clamp(-((event.clientY - bounds.top) / bounds.height - 0.5) * 2, -1, 1),
      );
      if (activePointerId !== null) {
        if (event.pointerType === "mouse" && !(event.buttons & 1)) { endDrag(); return; }
        const dx = THREE.MathUtils.clamp(event.clientX - lastX, -50, 50);
        const dy = THREE.MathUtils.clamp(event.clientY - lastY, -50, 50);
        dragX = wrapAngle(dragX + dx * 0.003);
        dragY = THREE.MathUtils.clamp(dragY + dy * 0.002, -0.6, 0.6);
        lastX = event.clientX;
        lastY = event.clientY;
      }
    };
    const down = (event) => {
      const stage = event.target.closest("[data-metal-stage]");
      if (!stage || event.button !== 0 || !event.isPrimary || activePointerId !== null) return;
      activePointerId = event.pointerId;
      captureTarget = stage;
      lastX = event.clientX;
      lastY = event.clientY;
      stage.setPointerCapture(event.pointerId);
    };
    function endDrag() {
      const id = activePointerId;
      const target = captureTarget;
      activePointerId = null;
      captureTarget = null;
      // Discard any queued drag motion after release or loss of focus.
      const turn = !reducedMotion && !controls.current.paused ? smoothPointer.x * 0.15 + Math.sin(elapsed * 0.22) * 0.06 : 0;
      if (id !== null) {
        dragX = wrapAngle(assembly.rotation.y + 0.58 - turn);
        dragY = THREE.MathUtils.clamp(assembly.rotation.x - 0.32 - (!reducedMotion && !controls.current.paused ? smoothPointer.y * 0.09 : 0), -0.6, 0.6);
        if (target?.hasPointerCapture(id)) target.releasePointerCapture(id);
      }
    }
    const up = event => { if (event.pointerId === activePointerId) endDrag(); };
    const leave = () => { if (activePointerId === null) pointer.set(0, 0); };
    const blur = () => { endDrag(); pointer.set(0, 0); smoothPointer.set(0, 0); previousTime = null; };
    const visibility = () => {
      if (document.hidden) { blur(); cancelAnimationFrame(frame); frame = 0; }
      else invalidate();
    };
    const motionChange = (event) => { reducedMotion = event.matches; };
    const lost = (event) => { event.preventDefault(); blur(); contextLost = true; cancelAnimationFrame(frame); frame = 0; onStatus("unavailable"); };
    const restored = () => { contextLost = false; onStatus("ready"); invalidate(); };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    renderer.domElement.addEventListener("webglcontextrestored", restored);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) invalidate();
      else { blur(); cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(surface);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    surface.addEventListener("pointermove", move, { passive: true });
    surface.addEventListener("pointerdown", down);
    surface.addEventListener("pointerup", up);
    surface.addEventListener("pointercancel", up);
    surface.addEventListener("lostpointercapture", up);
    surface.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", blur);
    motionQuery.addEventListener("change", motionChange);
    resize();
    onStatus("ready");

    return () => {
      endDrag();
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerdown", down);
      surface.removeEventListener("pointerup", up);
      surface.removeEventListener("pointercancel", up);
      surface.removeEventListener("lostpointercapture", up);
      surface.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", blur);
      motionQuery.removeEventListener("change", motionChange);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.removeEventListener("webglcontextrestored", restored);
      scene.traverse((object) => { object.geometry?.dispose(); if (object.material) object.material.dispose(); });
      grain.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [surfaceRef, onStatus]);

  return <div ref={hostRef} />;
}
