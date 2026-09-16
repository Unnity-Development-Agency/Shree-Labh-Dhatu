"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { storyValues } from "@/data/storyValues";
import { frameDelta, wrapAngle } from "@/components/home/heroMotion.mjs";

const STEP = (Math.PI * 2) / storyValues.length;

function lines(ctx, text, x, y, width, lineHeight) {
  let line = "";
  for (const word of text.split(" ")) {
    if (ctx.measureText(`${line}${word}`).width > width && line) {
      ctx.fillText(line.trim(), x, y);
      line = "";
      y += lineHeight;
    }
    line += `${word} `;
  }
  ctx.fillText(line.trim(), x, y);
  return y + lineHeight;
}

function cardTexture(value, index, theme) {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = theme.surface;
  ctx.fillRect(0, 0, 720, 1000);
  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 680, 960);
  ctx.fillStyle = theme.muted;
  ctx.font = "500 19px Arial";
  ctx.fillText(value.label.toUpperCase(), 60, 85);
  ctx.fillStyle = theme.accent;
  ctx.fillText(`0${index + 1}`, 625, 85);
  // Restrained line-art icons are drawn into the actual WebGL card texture.
  ctx.save();
  ctx.translate(110, 225);
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (value.icon === "quality") {
    ctx.moveTo(0, -48);
    ctx.lineTo(46, -28);
    ctx.lineTo(38, 28);
    ctx.quadraticCurveTo(0, 70, -38, 28);
    ctx.lineTo(-46, -28);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-4, 16);
    ctx.lineTo(25, -17);
  } else if (value.icon === "trust") {
    ctx.arc(-20, 0, 33, -0.8, Math.PI * 1.8);
    ctx.moveTo(53, 0);
    ctx.arc(20, 0, 33, 0, Math.PI * 2);
  } else {
    for (let n = 0; n < 3; n++) {
      const y = n * 23 - 36;
      ctx.moveTo(-48, y);
      ctx.lineTo(0, y - 22);
      ctx.lineTo(48, y);
      ctx.lineTo(0, y + 22);
      ctx.closePath();
    }
  }
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = theme.ink;
  ctx.font = "500 57px Arial";
  const end = lines(ctx, value.title, 60, 380, 590, 68);
  ctx.fillStyle = theme.muted;
  ctx.font = "27px Arial";
  lines(ctx, value.description, 60, end + 45, 590, 45);
  ctx.strokeStyle = theme.line;
  ctx.beginPath();
  ctx.moveTo(60, 840);
  ctx.lineTo(660, 840);
  ctx.stroke();
  ctx.fillStyle = theme.muted;
  ctx.font = "20px Arial";
  ctx.fillText(value.detail, 60, 902);
  ctx.strokeStyle = theme.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(606, 895);
  ctx.lineTo(647, 895);
  ctx.moveTo(634, 882);
  ctx.lineTo(647, 895);
  ctx.lineTo(634, 908);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function StoryScene({
  selection,
  paused,
  onActive,
  onReady,
  onSelect,
}) {
  const hostRef = useRef(null);
  const wakeRef = useRef(() => {});
  const state = useRef({ selection, paused, onActive, onReady, onSelect });
  useEffect(() => {
    state.current = { selection, paused, onActive, onReady, onSelect };
    wakeRef.current();
  }, [selection, paused, onActive, onReady, onSelect]);

  useEffect(() => {
    const host = hostRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");
    const computed = getComputedStyle(host);
    const token = (name) => computed.getPropertyValue(name).trim();
    const theme = {
      surface: token("--surface"),
      ink: token("--ink"),
      muted: token("--muted"),
      line: token("--line"),
      accent: token("--brand-ink"),
    };
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.z = 11;
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-4, 7, 8);
    scene.add(light);
    const geometry = new RoundedBoxGeometry(2.75, 3.85, 0.09, 3, 0.06);
    const faceGeometry = new THREE.PlaneGeometry(2.66, 3.75);
    const cards = storyValues.map((value, index) => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: theme.line,
          roughness: 0.5,
          metalness: 0.12,
        }),
      );
      const texture = cardTexture(value, index, theme);
      texture.anisotropy = Math.min(
        4,
        renderer.capabilities.getMaxAnisotropy(),
      );
      const face = new THREE.Mesh(
        faceGeometry,
        new THREE.MeshBasicMaterial({ map: texture }),
      );
      face.position.z = 0.051;
      face.userData.index = index;
      group.add(body, face);
      scene.add(group);
      return { group, body, face, texture };
    });
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motion.matches;
    let mobile = false;
    let visible = true;
    let lost = false;
    let angle = 0;
    let target = 0;
    let elapsed = 0;
    let request = -1;
    let manualTurning = false;
    let lastActive = -1;
    let frame = 0;
    let previous = null;
    let touchStart = null;
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const hover = new THREE.Vector2();

    function draw(time) {
      frame = 0;
      if (!visible || document.hidden || lost) return;
      const dt = frameDelta(time, previous);
      previous = time;
      const current = state.current;
      const manual = current.selection.request !== request;
      if (manual) {
        manualTurning = true;
        request = current.selection.request;
        target = angle + wrapAngle(-current.selection.index * STEP - angle);
        elapsed = 0;
      }
      if (!reduced && !current.paused) {
        elapsed += dt;
        if (elapsed > 4.5) {
          target -= STEP;
          elapsed = 0;
        }
      }
      // Hover freezes a running turn; explicit keyboard/pagination choices remain usable.
      if (manualTurning || !current.paused || reduced) {
        if (reduced) angle = target;
        else angle += (target - angle) * (1 - Math.exp(-dt * 4));
      }
      const active = ((Math.round(-angle / STEP) % 3) + 3) % 3;
      if (active !== lastActive) {
        lastActive = active;
        current.onActive(active);
      }
      hover.lerp(pointer, 1 - Math.exp(-dt * 7));
      cards.forEach(({ group }, index) => {
        const phase = angle + index * STEP;
        const front = (Math.cos(phase) + 1) / 2;
        group.position.set(
          Math.sin(phase) * (mobile ? 0.24 : 2.65),
          mobile ? -0.1 * (1 - front) : 0,
          Math.cos(phase) * (mobile ? 0.65 : 1.25),
        );
        group.rotation.y =
          -Math.sin(phase) * (mobile ? 0.035 : 0.2) +
          (index === active && !reduced ? hover.x * 0.025 : 0);
        group.rotation.x = index === active && !reduced ? -hover.y * 0.025 : 0;
        group.scale.setScalar(0.84 + front * 0.16);
      });
      renderer.render(scene, camera);
      const moving = Math.abs(target - angle) > 0.0001;
      if (!moving) manualTurning = false;
      if (
        (!reduced && !current.paused) ||
        (moving && (!current.paused || manualTurning)) ||
        hover.distanceTo(pointer) > 0.001
      )
        frame = requestAnimationFrame(draw);
    }
    const wake = () => {
      if (!frame) {
        previous = null;
        frame = requestAnimationFrame(draw);
      }
    };
    function resize() {
      const { width, height } = host.getBoundingClientRect();
      mobile = width < 460;
      camera.aspect = width / Math.max(height, 1);
      camera.position.z = mobile ? 8.1 : width < 600 ? 12.5 : 11;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      wake();
    }
    function pointerMove(e) {
      if (e.pointerType !== "mouse" || reduced) return;
      const r = host.getBoundingClientRect();
      pointer.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
      wake();
    }
    function leave() {
      pointer.set(0, 0);
      wake();
    }
    function down(e) {
      touchStart = { x: e.clientX, y: e.clientY };
    }
    function up(e) {
      if (!touchStart) return;
      const dx = e.clientX - touchStart.x,
        dy = e.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        state.current.onSelect(lastActive + (dx < 0 ? 1 : -1));
        return;
      }
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) return;
      const r = host.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          (-(e.clientY - r.top) / r.height) * 2 + 1,
        ),
        camera,
      );
      const hit = raycaster.intersectObjects(cards.map((card) => card.face))[0];
      if (hit) state.current.onSelect(hit.object.userData.index);
    }
    function motionChange() {
      reduced = motion.matches;
      wake();
    }
    function contextLost(e) {
      e.preventDefault();
      lost = true;
      state.current.onReady(false);
    }
    function contextRestored() {
      lost = false;
      state.current.onReady(true);
      wake();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    observer.observe(host);
    wakeRef.current = wake;
    host.addEventListener("pointermove", pointerMove);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerdown", down);
    host.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      contextRestored,
    );
    motion.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", wake);
    resize();
    state.current.onReady(true);
    return () => {
      wakeRef.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", pointerMove);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointerup", up);
      motion.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", wake);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      cards.forEach(({ body, face, texture }) => {
        body.material.dispose();
        face.material.dispose();
        texture.dispose();
      });
      geometry.dispose();
      faceGeometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={hostRef} />;
}
