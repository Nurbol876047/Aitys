import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeTitleTexture(lines) {
  const font =
    "900 156px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  const measureCanvas = document.createElement("canvas");
  const measureContext = measureCanvas.getContext("2d");
  measureContext.font = font;
  const textWidth = Math.max(
    ...lines.map((line) => measureContext.measureText(line).width),
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(textWidth + 120);
  canvas.height = 760;
  const context = canvas.getContext("2d");

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = font;
  context.lineJoin = "round";

  lines.forEach((line, index) => {
    const y = 148 + index * 190;
    context.strokeStyle = "rgba(255,255,255,0.86)";
    context.lineWidth = 18;
    context.strokeText(line, 34, y);
    context.fillStyle = "#0f3d4f";
    context.fillText(line, 34, y);
    context.fillStyle = "rgba(15,131,189,0.32)";
    context.fillText(line, 46, y + 16);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.userData.aspect = canvas.width / canvas.height;
  return texture;
}

export default function ThreeProblemTitle({
  lines = ["Табиғат тынысы", "Аралмен бірге", "қайта оянсын"],
}) {
  const mountRef = useRef(null);
  const title = lines.join(" ");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 30);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const texture = makeTitleTexture(lines);
    const planeHeight = 3.12;
    const planeWidth = planeHeight * texture.userData.aspect;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const depthGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    const depthMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x7cc9c8,
      transparent: true,
      opacity: 0.76,
      depthWrite: false,
    });
    const frontMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    for (let i = 5; i >= 1; i -= 1) {
      const layer = new THREE.Mesh(depthGeometry, depthMaterial);
      layer.position.set(i * 0.035, -i * 0.045, -i * 0.045);
      group.add(layer);
    }

    const front = new THREE.Mesh(geometry, frontMaterial);
    group.add(front);

    const light = new THREE.PointLight(0xffffff, 1.4, 18);
    light.position.set(-2.6, 2.4, 5);
    scene.add(light);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight);
      const aspect = clientWidth / Math.max(clientHeight, 1);
      const viewHeight = clientWidth < 520 ? 3.82 : 3.74;
      const viewWidth = viewHeight * aspect;
      camera.left = -viewWidth / 2;
      camera.right = viewWidth / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      const narrow = clientWidth < 520;
      group.scale.setScalar(narrow ? 0.77 : 1);
      group.position.x = -viewWidth / 2 + (planeWidth * group.scale.x) / 2 - 0.08;
      group.userData.baseY = narrow ? 0.08 : 0.02;
      group.position.y = group.userData.baseY;
    };
    resize();
    window.addEventListener("resize", resize);

    let frameId;
    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.x = Math.sin(elapsed * 0.75) * 0.035;
      group.rotation.y = Math.sin(elapsed * 0.52) * 0.065;
      group.position.y = (group.userData.baseY ?? 0) + Math.sin(elapsed * 0.8) * 0.09;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      texture.dispose();
      geometry.dispose();
      depthGeometry.dispose();
      frontMaterial.dispose();
      depthMaterial.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [title]);

  return (
    <div className="relative mt-3 h-[190px] md:h-[250px]">
      <h2 className="sr-only">{title}</h2>
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
