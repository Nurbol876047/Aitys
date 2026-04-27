import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

function makeWaterShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-2.85, 0.45);
  shape.bezierCurveTo(-2.2, 1.28, -1.12, 1.42, -0.35, 0.92);
  shape.bezierCurveTo(0.32, 0.52, 1.16, 0.85, 1.92, 0.34);
  shape.bezierCurveTo(2.72, -0.18, 2.36, -1.06, 1.38, -1.23);
  shape.bezierCurveTo(0.5, -1.42, -0.22, -0.78, -0.94, -1.03);
  shape.bezierCurveTo(-1.94, -1.38, -3.08, -0.82, -2.85, 0.45);
  return shape;
}

function createSaltPoints() {
  const positions = [];
  for (let i = 0; i < 180; i += 1) {
    const x = THREE.MathUtils.randFloatSpread(6.2);
    const y = THREE.MathUtils.randFloatSpread(3.4);
    const outsideCenter = Math.abs(x) + Math.abs(y) * 1.35 > 1.15;
    if (outsideCenter) {
      positions.push(x, y, THREE.MathUtils.randFloat(0.05, 0.12));
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return geometry;
}

export default function AralThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4, 4, 2.45, -2.45, 0.1, 20);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    const sun = new THREE.DirectionalLight(0xfff2d0, 2.3);
    sun.position.set(2.6, 2.8, 4);
    scene.add(ambient, sun);

    const sandGeometry = new THREE.PlaneGeometry(7.6, 4.6, 80, 48);
    const vertices = sandGeometry.attributes.position;
    for (let i = 0; i < vertices.count; i += 1) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      vertices.setZ(i, Math.sin(x * 2.2) * 0.025 + Math.cos(y * 3.2) * 0.022);
    }
    sandGeometry.computeVertexNormals();

    const sand = new THREE.Mesh(
      sandGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xc79d5a,
        roughness: 0.95,
        metalness: 0.02,
      }),
    );
    scene.add(sand);

    const water = new THREE.Mesh(
      new THREE.ShapeGeometry(makeWaterShape(), 96),
      new THREE.MeshPhysicalMaterial({
        color: 0x0f83bd,
        transparent: true,
        opacity: 0.84,
        roughness: 0.18,
        metalness: 0.04,
        clearcoat: 0.7,
        clearcoatRoughness: 0.22,
      }),
    );
    water.position.z = 0.08;
    water.rotation.z = -0.12;
    scene.add(water);

    const coast = new THREE.LineSegments(
      new THREE.EdgesGeometry(water.geometry),
      new THREE.LineBasicMaterial({
        color: 0xf7f1df,
        transparent: true,
        opacity: 0.58,
      }),
    );
    coast.position.copy(water.position);
    coast.rotation.copy(water.rotation);
    scene.add(coast);

    const salt = new THREE.Points(
      createSaltPoints(),
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.035,
        transparent: true,
        opacity: 0.18,
      }),
    );
    salt.position.z = 0.16;
    scene.add(salt);

    const driedTrace = new THREE.Mesh(
      new THREE.ShapeGeometry(makeWaterShape(), 96),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12,
      }),
    );
    driedTrace.scale.set(1.1, 1.08, 1);
    driedTrace.rotation.z = water.rotation.z;
    driedTrace.position.z = 0.045;
    scene.add(driedTrace);

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.35, yoyo: true });
    timeline
      .to(
        water.scale,
        {
          x: 0.38,
          y: 0.48,
          duration: 5.4,
          ease: "power2.inOut",
        },
        0,
      )
      .to(
        coast.scale,
        {
          x: 0.38,
          y: 0.48,
          duration: 5.4,
          ease: "power2.inOut",
        },
        0,
      )
      .to(water.material, { opacity: 0.56, duration: 5.4, ease: "sine.inOut" }, 0)
      .to(salt.material, { opacity: 0.78, duration: 5.4, ease: "sine.inOut" }, 0)
      .to(driedTrace.material, { opacity: 0.34, duration: 5.4, ease: "sine.inOut" }, 0);

    let frameId;
    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();
      salt.rotation.z = Math.sin(elapsed * 0.22) * 0.025;
      water.position.y = Math.sin(elapsed * 0.9) * 0.035;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      timeline.kill();
      renderer.dispose();
      sandGeometry.dispose();
      water.geometry.dispose();
      water.material.dispose();
      coast.geometry.dispose();
      coast.material.dispose();
      salt.geometry.dispose();
      salt.material.dispose();
      driedTrace.geometry.dispose();
      driedTrace.material.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
