"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { approachAngle, frameDelta, wrapAngle } from "./heroMotion.mjs";
import { createShowroom, createStudioEnvironment, FINISHES } from "./metalShowroom";
import { createMetalSpecimens } from "./metalSpecimens";

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
  const wakeRef = useRef(null);
  const controls = useRef({ selected, expanded, paused, resetKey });
  useEffect(() => { controls.current = { selected, expanded, paused, resetKey }; wakeRef.current?.(); }, [selected, expanded, paused, resetKey]);

  useEffect(() => {
    const host = hostRef.current;
    const surface = surfaceRef.current;
    if (!host || !surface) return;
    const lowPower = window.matchMedia("(max-width: 767px)").matches || (navigator.hardwareConcurrency || 8) <= 4;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: false, antialias: !lowPower, powerPreference: "low-power" });
    } catch {
      onStatus("unavailable");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !lowPower;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(0, 1.3, 15);
    camera.lookAt(0, 0, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = createStudioEnvironment(pmrem, lowPower);
    scene.environment = environment.texture;
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
    const showroom = createShowroom(scene, grain, lowPower);
    showroom.update(FINISHES[controls.current.selected] || FINISHES[0], 1, renderer);
    const assembly = new THREE.Group();
    scene.add(assembly);
    const sheets = [];
    for (let i = 0; i < 3; i++) {
      const finish = FINISHES[controls.current.selected] || FINISHES[0];
      const material = showroom.lightMaterial(new THREE.MeshPhysicalMaterial({ color: finish.color, roughness: finish.roughness, metalness: finish.metalness, clearcoat: finish.coat, clearcoatRoughness: 0.55, anisotropy: lowPower ? 0 : finish.anisotropy, side: THREE.DoubleSide, bumpMap: grain, bumpScale: 0.006, envMapIntensity: 1.1 }));
      const geometry = rolledSheet(1.05, -0.9);
      const sheet = new THREE.Mesh(geometry, material);
      sheet.castShadow = true;
      sheet.receiveShadow = true;
      sheet.position.z = (i - 1) * 1.13;
      sheet.position.y = (i - 1) * 0.07;
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 25), new THREE.LineBasicMaterial({ color: finish.reflection, transparent: true, opacity: 0.14 }));
      sheet.add(edge);
      assembly.add(sheet);
      sheets.push(sheet);
    }
    assembly.rotation.set(0.32, -0.58, -0.25);
    const restBounds = new THREE.Box3().setFromObject(assembly, true);
    const restCenter = restBounds.getCenter(new THREE.Vector3());
    const restSize = restBounds.getSize(new THREE.Vector3());
    const restPoints = [];
    for (const sheet of sheets) {
      const positions = sheet.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        restPoints.push(new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(sheet.matrixWorld));
      }
    }
    const specimens = createMetalSpecimens(scene, sheets[0].material, lowPower);

    const cursorLight = new THREE.PointLight(0xffe7ca, 3, 18, 2);
    cursorLight.position.set(3, 3, 6);
    scene.add(cursorLight);

    let mobile = false;
    let frame = 0;
    let readyFrame = 0;
    let readyReported = false;
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
    let lastExpanded = controls.current.expanded;
    let scrollSpread = 0;
    let manualLayout = false;
    let settleUntil = 0;
    const pointer = new THREE.Vector2();
    const smoothPointer = new THREE.Vector2();
    const targetColor = new THREE.Color();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    function render(time) {
      frame = 0;
      if ((!visible && readyReported) || document.hidden || contextLost) return;
      const delta = frameDelta(time, previousTime);
      const transitionDelta = previousTime === null ? 0 : Math.max(0, (time - previousTime) / 1000);
      previousTime = time;
      const state = controls.current;
      const motionEnabled = !reducedMotion && !state.paused;
      if (motionEnabled) elapsed += delta;
      if (lastExpanded !== state.expanded) {
        manualLayout = true;
        lastExpanded = state.expanded;
      }
      if (lastReset !== state.resetKey) {
        endDrag();
        dragX = dragY = 0;
        pointer.set(0, 0);
        smoothPointer.set(0, 0);
        lastReset = state.resetKey;
        manualLayout = true;
      }
      const ease = reducedMotion ? 1 : 1 - Math.exp(-transitionDelta * 5);
      // Approximately 99% settled in 1.1s; interrupted selections blend from
      // the currently visible material instead of restarting from a preset.
      const materialEase = reducedMotion ? 1 : 1 - Math.exp(-transitionDelta * 4.5);
      smoothPointer.lerp(pointer, ease);
      const turn = motionEnabled ? smoothPointer.x * 0.15 + Math.sin(elapsed * 0.22) * 0.06 : 0;
      const targetY = -0.58 + dragX + turn;
      const targetX = 0.32 + dragY + (motionEnabled ? smoothPointer.y * 0.09 : 0);
      const targetZ = -0.25 + (motionEnabled ? Math.sin(elapsed * 0.3) * 0.025 : 0);
      assembly.rotation.y = reducedMotion ? wrapAngle(targetY) : approachAngle(assembly.rotation.y, targetY, delta);
      assembly.rotation.x = reducedMotion ? targetX : approachAngle(assembly.rotation.x, targetX, delta);
      assembly.rotation.z = reducedMotion ? targetZ : approachAngle(assembly.rotation.z, targetZ, delta);
      const finish = FINISHES[state.selected] || FINISHES[0];
      showroom.update(finish, materialEase, renderer);
      targetColor.setHex(finish.color);
      sheets.forEach((sheet, i) => {
        const automaticSpread = !reducedMotion && !manualLayout ? scrollSpread * 0.46 : 0;
        const spacing = state.expanded ? 1.95 : 1.13 + automaticSpread;
        sheet.position.z = THREE.MathUtils.lerp(sheet.position.z, (i - 1) * spacing, ease);
        sheet.material.color.lerp(targetColor, materialEase);
        sheet.material.roughness = THREE.MathUtils.lerp(sheet.material.roughness, finish.roughness, materialEase);
        sheet.material.metalness = THREE.MathUtils.lerp(sheet.material.metalness, finish.metalness, materialEase);
        sheet.material.clearcoat = THREE.MathUtils.lerp(sheet.material.clearcoat, finish.coat, materialEase);
        if (!lowPower) sheet.material.anisotropy = THREE.MathUtils.lerp(sheet.material.anisotropy, finish.anisotropy, materialEase);
        sheet.children[0].material.color.lerp(newEdgeColor.setHex(finish.reflection), materialEase);
      });
      cursorLight.color.lerp(newEdgeColor.setHex(finish.key), materialEase);
      cursorLight.position.x = (mobile ? 0 : 3) + smoothPointer.x * 1.2;
      cursorLight.position.y = 4 + smoothPointer.y;
      specimens.update(dragX, dragY, smoothPointer, elapsed, motionEnabled, ease);
      renderer.render(scene, camera);
      if (!readyReported && !readyFrame) {
        readyFrame = requestAnimationFrame(() => {
          readyFrame = 0;
          if (contextLost) return;
          readyReported = true;
          onStatus("ready");
        });
      }
      const rotationSettled = Math.abs(wrapAngle(targetY - assembly.rotation.y)) < 0.001
        && Math.abs(wrapAngle(targetX - assembly.rotation.x)) < 0.001
        && Math.abs(wrapAngle(targetZ - assembly.rotation.z)) < 0.001;
      if (motionEnabled || activePointerId !== null || time < settleUntil || !rotationSettled) frame = requestAnimationFrame(render);
    }
    const newEdgeColor = new THREE.Color();
    function invalidate() {
      settleUntil = performance.now() + 2400;
      if (!frame && (visible || !readyReported) && !document.hidden && !contextLost) {
        previousTime = null;
        frame = requestAnimationFrame(render);
      }
    }
    // A gentle open/close arc as the existing hero leaves the viewport.
    // Manual gather/reset takes priority until the next actual page scroll.
    const scroll = () => {
      const bounds = surface.getBoundingClientRect();
      const progress = bounds.height ? THREE.MathUtils.clamp(-bounds.top / bounds.height, 0, 1) : 0;
      scrollSpread = Math.sin(progress * Math.PI);
      manualLayout = false;
      if (progress === 1 && !controls.current.expanded) {
        sheets.forEach((sheet, i) => { sheet.position.z = (i - 1) * 1.13; });
      }
      invalidate();
    };
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const { width, height } = bounds;
      if (!width || !height) return;
      mobile = width < 1024;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.set(0, 0, 15);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      const stage = surface.querySelector("[data-metal-stage]").getBoundingClientRect();
      const tools = surface.querySelector("[data-metal-tools]")?.getBoundingClientRect();
      const stageBottom = !mobile && tools ? Math.min(stage.bottom + 24, tools.top - 6) : stage.bottom;
      const fitLeft = mobile ? stage.left + 12 : Math.max(stage.left, bounds.left + width * 0.53);
      const fitRight = Math.min(stage.right - 12, bounds.right - 12);
      const fitTop = stage.top + 8;
      const stageHeight = Math.max(160, stageBottom - fitTop);
      const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const unitsPerPixel = viewHeight / height;
      const centerX = (fitLeft + fitRight) / 2;
      const centerY = fitTop + stageHeight / 2;
      const placeAssembly = (scale) => {
        assembly.scale.setScalar(scale);
        assembly.position.set(
          (centerX - bounds.left - width / 2) * unitsPerPixel - restCenter.x * scale,
          (height / 2 - (centerY - bounds.top)) * unitsPerPixel - restCenter.y * scale,
          0,
        );
      };
      // Fit actual surface vertices rather than empty bounding-box corners.
      // This makes the coil larger while keeping it above the controls.
      const corner = new THREE.Vector3();
      let lower = 0;
      let upper = Math.min((fitRight - fitLeft) * unitsPerPixel / restSize.x, stageHeight * unitsPerPixel / restSize.y);
      for (let pass = 0; pass < 16; pass++) {
        const candidate = (lower + upper) / 2;
        placeAssembly(candidate);
        let fits = true;
        for (const point of restPoints) {
          corner.copy(point).multiplyScalar(candidate).add(assembly.position).project(camera);
          const x = bounds.left + (corner.x + 1) * width / 2;
          const y = bounds.top + (1 - corner.y) * height / 2;
          if (x < fitLeft || x > fitRight || y < fitTop || y > stageBottom) fits = false;
        }
        if (fits) lower = candidate;
        else upper = candidate;
      }
      const scale = lower * 0.98;
      placeAssembly(scale);
      showroom.place(assembly.position.x + restCenter.x * scale, assembly.position.y + restCenter.y * scale, scale, assembly.position.y + restBounds.min.y * scale);
      specimens.place(assembly.position.x + restCenter.x * scale, assembly.position.y + restBounds.min.y * scale - 0.09, scale);
      scroll();
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
      invalidate();
    };
    const down = (event) => {
      const stage = event.target.closest("[data-metal-stage]");
      if (!stage || event.button !== 0 || !event.isPrimary || activePointerId !== null) return;
      activePointerId = event.pointerId;
      captureTarget = stage;
      lastX = event.clientX;
      lastY = event.clientY;
      stage.setPointerCapture(event.pointerId);
      invalidate();
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
    const motionChange = (event) => { reducedMotion = event.matches; invalidate(); };
    const lost = (event) => { event.preventDefault(); blur(); contextLost = true; cancelAnimationFrame(frame); frame = 0; onStatus("unavailable"); };
    const restored = () => { contextLost = false; readyReported = false; invalidate(); };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    renderer.domElement.addEventListener("webglcontextrestored", restored);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible || !readyReported) invalidate();
      else { blur(); cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(surface);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const toolsElement = surface.querySelector("[data-metal-tools]");
    if (toolsElement) resizeObserver.observe(toolsElement);
    surface.addEventListener("pointermove", move, { passive: true });
    surface.addEventListener("pointerdown", down);
    surface.addEventListener("pointerup", up);
    surface.addEventListener("pointercancel", up);
    surface.addEventListener("lostpointercapture", up);
    surface.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", blur);
    window.addEventListener("scroll", scroll, { passive: true });
    motionQuery.addEventListener("change", motionChange);
    wakeRef.current = invalidate;
    resize();

    return () => {
      wakeRef.current = null;
      endDrag();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(readyFrame);
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
      window.removeEventListener("scroll", scroll);
      motionQuery.removeEventListener("change", motionChange);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.removeEventListener("webglcontextrestored", restored);
      const resources = new Set();
      scene.traverse((object) => { if (object.geometry) resources.add(object.geometry); if (object.material) resources.add(object.material); });
      resources.forEach((resource) => resource.dispose());
      showroom.dispose();
      grain.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [surfaceRef, onStatus]);

  return <div ref={hostRef} />;
}
