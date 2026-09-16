import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// Order matches the existing hero selectors. Values are lighting presets, not UI state.
export const FINISHES = [
  {
    color: 0xc98760,
    roughness: 0.38,
    metalness: 1,
    coat: 0.015,
    anisotropy: 0.42,
    environment: 1.15,
    rotation: -0.25,
    background: 0x100c0b,
    wall: 0x30221c,
    floor: 0x28221f,
    key: 0xffe1c5,
    rim: 0xffa66d,
    accent: 0xd57543,
    reflection: 0xffd3ac,
    keyPower: 3.4,
    rimPower: 4.5,
    exposure: 1.03,
  },
  {
    color: 0xc6a451,
    roughness: 0.39,
    metalness: 1,
    coat: 0.015,
    anisotropy: 0.38,
    environment: 1.2,
    rotation: 0.15,
    background: 0x100e09,
    wall: 0x302a1a,
    floor: 0x29261c,
    key: 0xffecc5,
    rim: 0xffd477,
    accent: 0xc39c43,
    reflection: 0xffe3af,
    keyPower: 3.6,
    rimPower: 4.3,
    exposure: 1.06,
  },
  {
    color: 0xd3d9dc,
    roughness: 0.42,
    metalness: 0.98,
    coat: 0.015,
    anisotropy: 0.5,
    environment: 1.45,
    rotation: 0.35,
    background: 0x0d1115,
    wall: 0x272f36,
    floor: 0x262d32,
    key: 0xf4faff,
    rim: 0xd5e8ff,
    accent: 0xaabfce,
    reflection: 0xe4efff,
    keyPower: 4.2,
    rimPower: 4.8,
    exposure: 1.12,
  },
  {
    color: 0xaab7c1,
    roughness: 0.34,
    metalness: 1,
    coat: 0.015,
    anisotropy: 0.58,
    environment: 1.2,
    rotation: -0.1,
    background: 0x090d12,
    wall: 0x1a242f,
    floor: 0x1d252d,
    key: 0xe8f2ff,
    rim: 0xabcfff,
    accent: 0x6f92bb,
    reflection: 0xc5deff,
    keyPower: 3.8,
    rimPower: 5,
    exposure: 1.02,
  },
];

export function createStudioEnvironment(pmrem, lowPower) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x111317);
  // HDR softboxes surrounded by black flags produce distinct moving highlights,
  // rather than washing the entire metal surface with an evenly lit room.
  const panels = [
    [-5, 5, 4, 5, 7, 3.2],
    [5, 2, 1, 2.5, 8, 3.8],
    [0, 7, -2, 7, 3, 2.8],
    [-2, 0, -6, 3, 5, 1.6],
    [0, 0, 7, 5, 4, 0.8],
  ];
  for (const [x, y, z, width, height, intensity] of panels) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(1, 1, 1).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      }),
    );
    panel.position.set(x, y, z);
    panel.lookAt(0, 0, 0);
    studio.add(panel);
  }
  const environment = pmrem.fromScene(studio, 0.025, 0.1, 100, {
    size: lowPower ? 128 : 256,
  });
  studio.traverse((object) => {
    object.geometry?.dispose();
    object.material?.dispose();
  });
  return environment;
}

export function createShowroom(scene, grain, lowPower) {
  RectAreaLightUniformsLib.init();
  const group = new THREE.Group();
  scene.add(group);
  scene.background = new THREE.Color(FINISHES[0].background);
  scene.fog = new THREE.FogExp2(FINISHES[0].background, 0.028);
  const reflectionTint = { value: new THREE.Color(FINISHES[0].reflection) };

  // Tint the illumination sampled from the studio, retaining the PMREM's
  // directional softboxes and roughness mips. One environment lookup per lobe.
  function lightMaterial(material) {
    material.onBeforeCompile = (shader) => {
      shader.uniforms.showroomReflectionTint = reflectionTint;
      shader.uniforms.showroomReflectionStrength = {
        value: material.envMapIntensity,
      };
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <envmap_physical_pars_fragment>",
        "uniform vec3 showroomReflectionTint;\nuniform float showroomReflectionStrength;\n" +
          THREE.ShaderChunk.envmap_physical_pars_fragment.replaceAll(
            "envMapColor.rgb * envMapIntensity",
            "envMapColor.rgb * envMapIntensity * showroomReflectionStrength * mix(vec3(1.0), showroomReflectionTint, 0.75)",
          ),
      );
    };
    material.customProgramCacheKey = () => "showroom-light-v3";
    return material;
  }
  const wallMaterial = lightMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x30221c,
      metalness: 0.8,
      roughness: 0.55,
      envMapIntensity: 0.22,
      bumpMap: grain,
      bumpScale: 0.025,
    }),
  );
  const floorMaterial = lightMaterial(
    new THREE.MeshPhysicalMaterial({
      color: 0x28221f,
      metalness: 0.82,
      roughness: 0.34,
      envMapIntensity: 0.45,
      clearcoat: 0.08,
      clearcoatRoughness: 0.4,
      bumpMap: grain,
      bumpScale: 0.012,
    }),
  );
  const pedestalMaterial = lightMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x252526,
      metalness: 0.65,
      roughness: 0.35,
      envMapIntensity: 0.5,
      bumpMap: grain,
      bumpScale: 0.018,
    }),
  );
  const wall = new THREE.Mesh(new THREE.BoxGeometry(70, 35, 0.4), wallMaterial);
  wall.position.set(0, 7, -7);
  group.add(wall);
  // Offset slabs catch grazing light and give the background real depth.
  for (let i = 0; i < 5; i++) {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 12, 0.3),
      wallMaterial,
    );
    slab.position.set(-5.6 + i * 2.7, 3.8, -5.8 - (i % 2) * 0.65);
    slab.rotation.y = -0.18;
    slab.rotation.z = -0.12;
    group.add(slab);
  }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3.4;
  floor.receiveShadow = true;
  group.add(floor);
  const pedestal = new THREE.Mesh(
    new RoundedBoxGeometry(6.8, 0.42, 4.8, 2, 0.1),
    pedestalMaterial,
  );
  pedestal.position.set(0, -3.12, 0);
  pedestal.receiveShadow = true;
  pedestal.castShadow = true;
  group.add(pedestal);

  const stripMaterial = new THREE.MeshBasicMaterial({ color: 0xd57543 });
  for (let i = 0; i < 3; i++) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 7.2, 0.025),
      stripMaterial,
    );
    strip.position.set(-3.9 + i * 4.1, 2.8, -5.5);
    strip.rotation.z = -0.12;
    group.add(strip);
  }
  const key = new THREE.RectAreaLight(0xffe1c5, 5, 4, 6);
  key.position.set(-3.5, 5, 5);
  key.lookAt(0, 0, 0);
  const rim = new THREE.RectAreaLight(0xffa66d, 7, 2, 7);
  rim.position.set(4, 2, -2);
  rim.lookAt(0, 0, 0);
  const fill = new THREE.RectAreaLight(0xffe1c5, 0.7, 5, 3);
  fill.position.set(0, 1, 6);
  fill.lookAt(0, 0, 0);
  const pool = new THREE.PointLight(0xd57543, 24, 14, 2);
  pool.position.set(2, -1.8, 2);
  const shadow = new THREE.DirectionalLight(0xffe1c5, 0.9);
  shadow.position.set(-3, 7, 4);
  shadow.castShadow = !lowPower;
  shadow.shadow.mapSize.set(1024, 1024);
  Object.assign(shadow.shadow.camera, {
    left: -9,
    right: 9,
    top: 9,
    bottom: -9,
    near: 0.1,
    far: 45,
  });
  shadow.shadow.bias = -0.0005;
  shadow.shadow.normalBias = 0.04;
  shadow.shadow.radius = 3;
  group.add(key, rim, fill, pool, shadow, shadow.target);

  // A soft contact shadow also supports devices where shadow maps are disabled.
  const shadowMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader:
      "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader:
      "varying vec2 vUv; void main(){float d=length((vUv-.5)*2.0);gl_FragColor=vec4(0.,0.,0.,.55*(1.-smoothstep(.12,1.,d)));}",
  });
  const contact = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 4.3),
    shadowMaterial,
  );
  contact.rotation.x = -Math.PI / 2;
  contact.position.set(0, -2.899, 0);
  group.add(contact);

  // Low opacity shaft, with soft edges: atmosphere without a full-screen pass.
  const hazeMaterial = new THREE.ShaderMaterial({
    uniforms: { tint: { value: new THREE.Color(0xd57543) } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader:
      "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader:
      "uniform vec3 tint;varying vec2 vUv;void main(){float edge=pow(max(0.,sin(vUv.x*3.14159265)),3.);float fade=sin(vUv.y*3.14159265);gl_FragColor=vec4(tint,edge*fade*.025);}",
  });
  const haze = new THREE.Mesh(new THREE.PlaneGeometry(4, 13), hazeMaterial);
  haze.position.set(1.5, 3, -3.5);
  haze.rotation.z = -0.28;
  group.add(haze);
  const target = new THREE.Color();
  const tint = (color, hex, amount) => color.lerp(target.setHex(hex), amount);

  return {
    lightMaterial,
    place(centerX, centerY, scale, bottom) {
      group.scale.setScalar(scale);
      pool.intensity = 24 * scale * scale;
      pool.distance = 14 * scale;
      group.position.set(centerX, bottom + 2.9 * scale - 0.08, 0);
      // Keep the physical product at its existing position; only the room moves.
      shadow.target.position.y = (centerY - group.position.y) / scale;
    },
    update(finish, amount, renderer) {
      tint(scene.background, finish.background, amount);
      scene.fog.color.copy(scene.background);
      tint(wallMaterial.color, finish.wall, amount);
      tint(floorMaterial.color, finish.floor, amount);
      tint(key.color, finish.key, amount);
      tint(fill.color, finish.key, amount);
      tint(shadow.color, finish.key, amount);
      tint(rim.color, finish.rim, amount);
      tint(pool.color, finish.accent, amount);
      tint(stripMaterial.color, finish.accent, amount);
      tint(hazeMaterial.uniforms.tint.value, finish.accent, amount);
      tint(reflectionTint.value, finish.reflection, amount);
      key.intensity = THREE.MathUtils.lerp(
        key.intensity,
        finish.keyPower,
        amount,
      );
      rim.intensity = THREE.MathUtils.lerp(
        rim.intensity,
        finish.rimPower,
        amount,
      );
      scene.environmentIntensity = THREE.MathUtils.lerp(
        scene.environmentIntensity,
        finish.environment,
        amount,
      );
      scene.environmentRotation.y = THREE.MathUtils.lerp(
        scene.environmentRotation.y,
        finish.rotation,
        amount,
      );
      renderer.toneMappingExposure = THREE.MathUtils.lerp(
        renderer.toneMappingExposure,
        finish.exposure,
        amount,
      );
    },
    dispose() {
      shadow.shadow.dispose();
    },
  };
}
