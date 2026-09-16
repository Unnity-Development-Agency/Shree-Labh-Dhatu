import * as THREE from "three";

class WireCoil extends THREE.Curve {
  getPoint(t, target = new THREE.Vector3()) {
    const angle = t * Math.PI * 2 * 5;
    const radius = 0.25 + t * 0.44;
    return target.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  }
}

// Supporting material samples. They share the hero's finish and interaction
// state, while keeping their own gentle movement and leaving its layers intact.
export function createMetalSpecimens(scene, material, lowPower) {
  const group = new THREE.Group();
  scene.add(group);
  const rods = new THREE.Group();
  const rodGeometry = new THREE.CylinderGeometry(
    0.095,
    0.095,
    1.95,
    lowPower ? 12 : 24,
  );
  for (let i = 0; i < 4; i++) {
    const rod = new THREE.Mesh(rodGeometry, material);
    rod.position.set((i % 2) * 0.22, i * 0.09, Math.floor(i / 2) * 0.22);
    rod.castShadow = true;
    rods.add(rod);
  }
  rods.position.set(-1.6, 0.095, 0.5);
  rods.rotation.set(0, -0.28, Math.PI / 2);
  group.add(rods);

  const coil = new THREE.Mesh(
    new THREE.TubeGeometry(
      new WireCoil(),
      lowPower ? 112 : 180,
      0.04,
      lowPower ? 6 : 10,
      false,
    ),
    material,
  );
  coil.position.set(1.85, 0.04, 0.95);
  coil.castShadow = true;
  group.add(coil);

  const chain = new THREE.Group();
  const linkGeometry = new THREE.TorusGeometry(
    0.23,
    0.055,
    lowPower ? 8 : 12,
    lowPower ? 24 : 40,
  );
  for (let i = 0; i < 4; i++) {
    const link = new THREE.Mesh(linkGeometry, material);
    link.scale.x = 1.45;
    link.position.set((i - 1.5) * 0.49, i % 2 ? 0.254 : 0.055, 0);
    link.rotation.x = i % 2 ? Math.PI / 6 : Math.PI / 2;
    link.castShadow = true;
    chain.add(link);
  }
  chain.position.set(-0.15, 0, 1.75);
  chain.rotation.y = 0.1;
  group.add(chain);

  return {
    place(x, y, scale) {
      group.position.set(x, y, 0);
      group.scale.setScalar(scale);
    },
    update(turnX, turnY, pointer, elapsed, motionEnabled, ease) {
      const idle = motionEnabled ? Math.sin(elapsed * 0.7) : 0;
      const parallax = motionEnabled ? pointer.x * 0.015 : 0;
      // Yaw around the surface normal: the samples stay in contact with the
      // platform while responding to the same drag and pointer as the hero.
      rods.rotation.y = THREE.MathUtils.lerp(
        rods.rotation.y,
        -0.28 + turnX * 0.12 + parallax,
        ease,
      );
      coil.rotation.y = THREE.MathUtils.lerp(
        coil.rotation.y,
        turnX * 0.18 + turnY * 0.08 + idle * 0.025,
        ease,
      );
      chain.rotation.y = THREE.MathUtils.lerp(
        chain.rotation.y,
        0.1 + turnX * 0.08 + parallax,
        ease,
      );
    },
  };
}
