import { useEffect, useRef } from 'react';

export default function ThreeCityBackdrop({ density = 18, className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let disposed = false;
    let cleanup = () => {};

    import('three').then((THREE) => {
      if (disposed || !mountRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
      camera.position.set(0, 8, 17);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      group.rotation.x = -0.72;
      scene.add(group);

      const gridMaterial = new THREE.LineBasicMaterial({
        color: 0x27272a,
        transparent: true,
        opacity: 0.12,
      });
      const routeMaterial = new THREE.LineBasicMaterial({
        color: 0xff5722,
        transparent: true,
        opacity: 0.45,
      });
      const pointMaterial = new THREE.PointsMaterial({
        color: 0xff5722,
        size: 0.055,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      });
      const glowMaterial = new THREE.PointsMaterial({
        color: 0xff5722,
        size: 0.16,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });

      const gridLines = [];
      const size = 18;
      for (let i = -density; i <= density; i += 1) {
        const p = (i / density) * size;
        gridLines.push(new THREE.Vector3(-size, 0, p), new THREE.Vector3(size, 0, p));
        gridLines.push(new THREE.Vector3(p, 0, -size), new THREE.Vector3(p, 0, size));
      }
      const gridGeometry = new THREE.BufferGeometry().setFromPoints(gridLines);
      const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
      group.add(grid);

      const nodes = [];
      for (let x = -density; x <= density; x += 2) {
        for (let z = -density; z <= density; z += 2) {
          const px = (x / density) * size;
          const pz = (z / density) * size;
          nodes.push(px, Math.random() * 0.18, pz);
        }
      }
      const nodeGeometry = new THREE.BufferGeometry();
      nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodes, 3));
      const points = new THREE.Points(nodeGeometry, pointMaterial);
      group.add(points);

      const routePoints = [
        new THREE.Vector3(-14, 0.18, 8),
        new THREE.Vector3(-9, 0.22, 3),
        new THREE.Vector3(-4, 0.2, 4),
        new THREE.Vector3(1, 0.25, -1),
        new THREE.Vector3(7, 0.22, -4),
        new THREE.Vector3(13, 0.2, -8),
      ];
      const routeCurve = new THREE.CatmullRomCurve3(routePoints);
      const routeGeometry = new THREE.BufferGeometry().setFromPoints(routeCurve.getPoints(120));
      const route = new THREE.Line(routeGeometry, routeMaterial);
      group.add(route);

      const glowGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
      const glows = new THREE.Points(glowGeometry, glowMaterial);
      group.add(glows);

      const resize = () => {
        const width = mount.clientWidth || 1;
        const height = mount.clientHeight || 1;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();

      let frameId = 0;
      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        group.rotation.z = Math.sin(t * 0.18) * 0.035;
        group.position.y = Math.sin(t * 0.45) * 0.08;
        routeMaterial.opacity = 0.35 + Math.sin(t * 1.6) * 0.14;
        glowMaterial.opacity = 0.52 + Math.sin(t * 2) * 0.18;
        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(animate);
      };
      animate();

      window.addEventListener('resize', resize);

      cleanup = () => {
        window.removeEventListener('resize', resize);
        window.cancelAnimationFrame(frameId);
        group.remove(grid, points, route, glows);
        gridGeometry.dispose();
        nodeGeometry.dispose();
        routeGeometry.dispose();
        glowGeometry.dispose();
        gridMaterial.dispose();
        routeMaterial.dispose();
        pointMaterial.dispose();
        glowMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [density]);

  return <div ref={mountRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true" />;
}
