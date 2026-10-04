import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface VehicleCanvasProps {
  scrollProgress?: number;
  interactive?: boolean;
  carColor?: string;
  className?: string;
  showRings?: boolean;
}

export const VehicleCanvas: React.FC<VehicleCanvasProps> = ({
  scrollProgress = 0,
  interactive = true,
  carColor = '#0F172A',
  className = '',
  showRings = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [modelType, setModelType] = useState<'procedural' | 'gltf'>('procedural');
  const [webglSupported, setWebglSupported] = useState(true);

  // References for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<{ bodyMat?: THREE.MeshPhysicalMaterial; glowMat?: THREE.MeshBasicMaterial }>({});
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Test WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const isSupported = !!(window.WebGLRenderingContext && 
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
      if (!isSupported) {
        setWebglSupported(false);
        setLoading(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Subtle atmospheric fog matching deep charcoal background
    scene.fog = new THREE.FogExp2('#050607', 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.5, 2.2, 5.5);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous children
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting setup (Three-point studio lighting)
    // Key light (crisp cool white from front-top)
    const keyLight = new THREE.DirectionalLight('#F8FAFC', 2.8);
    keyLight.position.set(5, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    scene.add(keyLight);

    // Fill light (subtle cyan/teal energy ambient)
    const fillLight = new THREE.DirectionalLight('#06B6D4', 1.2);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    // Rim light (sharp emerald backlight highlighting vehicle silhouette)
    const rimLight = new THREE.DirectionalLight('#10B981', 2.0);
    rimLight.position.set(0, 4, -6);
    scene.add(rimLight);

    // Ground ambient bounce
    const hemiLight = new THREE.HemisphereLight('#0F172A', '#050607', 0.8);
    scene.add(hemiLight);

    // 5. Build Floor Grid & Ambient Shadow Plane
    const floorGroup = new THREE.Group();
    
    // Shadow receiver plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(16, 16);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    shadowPlane.receiveShadow = true;
    floorGroup.add(shadowPlane);

    // Modern glowing telemetry grid
    const gridHelper = new THREE.GridHelper(16, 24, '#10B981', '#1E293B');
    gridHelper.position.y = -0.02;
    const gridMat = gridHelper.material as THREE.LineBasicMaterial;
    gridMat.opacity = 0.22;
    gridMat.transparent = true;
    floorGroup.add(gridHelper);

    // Energy halo ring beneath vehicle
    if (showRings) {
      const ringGeo = new THREE.RingGeometry(1.6, 1.68, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: '#10B981',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const haloRing = new THREE.Mesh(ringGeo, ringMat);
      haloRing.rotation.x = -Math.PI / 2;
      haloRing.position.y = 0.005;
      floorGroup.add(haloRing);
    }

    scene.add(floorGroup);

    // 6. Floating Energy Particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = Math.random() * 2.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#06B6D4',
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 7. Vehicle Model Loading / Generation
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    // Try loading /models/ev-car.glb if available
    const loader = new GLTFLoader();
    loader.load(
      '/models/ev-car.glb',
      (gltf) => {
        carGroup.clear();
        const model = gltf.scene;
        model.scale.set(1.4, 1.4, 1.4);
        model.position.set(0, 0, 0);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        carGroup.add(model);
        setModelType('gltf');
        setLoading(false);
      },
      undefined,
      () => {
        // Fallback: Build High-End Procedural Luxury EV
        buildProceduralLuxuryEV(carGroup, carColor);
        setModelType('procedural');
        setLoading(false);
      }
    );

    // Helper to build procedural luxury EV
    function buildProceduralLuxuryEV(targetGroup: THREE.Group, baseColor: string) {
      targetGroup.clear();

      // Materials
      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: baseColor,
        metalness: 0.85,
        roughness: 0.22,
        clearcoat: 0.95,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
      });
      materialsRef.current.bodyMat = bodyMaterial;

      const carbonMaterial = new THREE.MeshStandardMaterial({
        color: '#0A0F15',
        metalness: 0.5,
        roughness: 0.6,
      });

      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: '#0F2633',
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.75,
        transparent: true,
        opacity: 0.85,
        reflectivity: 0.95,
      });

      const ledGlowMaterial = new THREE.MeshBasicMaterial({
        color: '#E0F2FE',
      });
      materialsRef.current.glowMat = ledGlowMaterial;

      const rearLedMaterial = new THREE.MeshBasicMaterial({
        color: '#EF4444',
      });

      const cyanAccentMaterial = new THREE.MeshBasicMaterial({
        color: '#06B6D4',
      });

      const wheelRimMaterial = new THREE.MeshStandardMaterial({
        color: '#1E293B',
        metalness: 0.9,
        roughness: 0.2,
      });

      const tireRubberMaterial = new THREE.MeshStandardMaterial({
        color: '#0B0F14',
        roughness: 0.85,
      });

      // --- Vehicle Body Construction ---
      // Lower Main Chassis (Sleek aerodynamic base)
      const chassisGeo = new THREE.BoxGeometry(2.1, 0.45, 4.3);
      // Taper front and back vertices for aerodynamic rake
      const pos = chassisGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const z = pos.getZ(i);
        const y = pos.getY(i);
        if (z > 1.2 && y > 0) {
          // Front nose drop
          pos.setY(i, y * 0.55);
        }
        if (z < -1.4 && y > 0) {
          // Rear aerodynamic spoiler curve
          pos.setY(i, y * 0.85);
        }
      }
      chassisGeo.computeVertexNormals();

      const chassis = new THREE.Mesh(chassisGeo, bodyMaterial);
      chassis.position.set(0, 0.55, 0);
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      targetGroup.add(chassis);

      // Aero Underbody Skirt (Deep charcoal composite)
      const skirtGeo = new THREE.BoxGeometry(2.14, 0.12, 4.35);
      const skirt = new THREE.Mesh(skirtGeo, carbonMaterial);
      skirt.position.set(0, 0.26, 0);
      targetGroup.add(skirt);

      // Cyan Underglow Strip
      const underglowGeo = new THREE.BoxGeometry(2.12, 0.02, 3.8);
      const underglow = new THREE.Mesh(underglowGeo, cyanAccentMaterial);
      underglow.position.set(0, 0.21, 0);
      targetGroup.add(underglow);

      // Cabin Greenhouse Glass Canopy
      const cabinGeo = new THREE.BoxGeometry(1.68, 0.55, 2.3);
      const cabinPos = cabinGeo.attributes.position;
      for (let i = 0; i < cabinPos.count; i++) {
        const y = cabinPos.getY(i);
        const z = cabinPos.getZ(i);
        if (y > 0) {
          // Taper cabin roof inward for sleek teardrop profile
          cabinPos.setX(i, cabinPos.getX(i) * 0.78);
          if (z > 0.4) cabinPos.setY(i, y * 0.88);
        }
      }
      cabinGeo.computeVertexNormals();

      const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
      cabin.position.set(0, 0.98, -0.2);
      cabin.castShadow = true;
      targetGroup.add(cabin);

      // Roof Aero Panel
      const roofGeo = new THREE.BoxGeometry(1.3, 0.04, 1.8);
      const roof = new THREE.Mesh(roofGeo, bodyMaterial);
      roof.position.set(0, 1.28, -0.25);
      roof.castShadow = true;
      targetGroup.add(roof);

      // Front LED Light Bar (Signature continuous EV beam)
      const frontLightBarGeo = new THREE.BoxGeometry(1.9, 0.06, 0.08);
      const frontLightBar = new THREE.Mesh(frontLightBarGeo, ledGlowMaterial);
      frontLightBar.position.set(0, 0.58, 2.16);
      targetGroup.add(frontLightBar);

      // Dual High-Performance Front Headlight Pods
      const leftHeadlightGeo = new THREE.BoxGeometry(0.35, 0.08, 0.12);
      const leftHeadlight = new THREE.Mesh(leftHeadlightGeo, ledGlowMaterial);
      leftHeadlight.position.set(0.85, 0.6, 2.12);
      targetGroup.add(leftHeadlight);

      const rightHeadlight = leftHeadlight.clone();
      rightHeadlight.position.set(-0.85, 0.6, 2.12);
      targetGroup.add(rightHeadlight);

      // Rear Full-Width Signature LED Light Bar
      const rearLightBarGeo = new THREE.BoxGeometry(1.92, 0.05, 0.08);
      const rearLightBar = new THREE.Mesh(rearLightBarGeo, rearLedMaterial);
      rearLightBar.position.set(0, 0.68, -2.16);
      targetGroup.add(rearLightBar);

      // Rear Diffuser (Carbon fins)
      const diffuserGeo = new THREE.BoxGeometry(1.8, 0.2, 0.4);
      const diffuser = new THREE.Mesh(diffuserGeo, carbonMaterial);
      diffuser.position.set(0, 0.32, -2.1);
      targetGroup.add(diffuser);

      // Side Mirrors (Aerodynamic digital camera winglets)
      const mirrorGeo = new THREE.BoxGeometry(0.24, 0.05, 0.14);
      const leftMirror = new THREE.Mesh(mirrorGeo, carbonMaterial);
      leftMirror.position.set(1.02, 0.9, 0.55);
      targetGroup.add(leftMirror);

      const rightMirror = leftMirror.clone();
      rightMirror.position.set(-1.02, 0.9, 0.55);
      targetGroup.add(rightMirror);

      // --- Wheels & Rotors ---
      const wheelPositions = [
        { x: 1.05, y: 0.38, z: 1.35 },  // Front Right
        { x: -1.05, y: 0.38, z: 1.35 }, // Front Left
        { x: 1.05, y: 0.38, z: -1.35 }, // Rear Right
        { x: -1.05, y: 0.38, z: -1.35 },// Rear Left
      ];

      wheelPositions.forEach((posCoord) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(posCoord.x, posCoord.y, posCoord.z);

        // Tire
        const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 32);
        tireGeo.rotateZ(Math.PI / 2);
        const tire = new THREE.Mesh(tireGeo, tireRubberMaterial);
        tire.castShadow = true;
        wheelGroup.add(tire);

        // Aero Rim Face
        const rimGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.25, 16);
        rimGeo.rotateZ(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, wheelRimMaterial);
        wheelGroup.add(rim);

        // Disc Center Accent (Cyan ring)
        const rimCapGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.26, 16);
        rimCapGeo.rotateZ(Math.PI / 2);
        const rimCap = new THREE.Mesh(rimCapGeo, cyanAccentMaterial);
        wheelGroup.add(rimCap);

        targetGroup.add(wheelGroup);
      });
    }

    // 8. Event Handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseRef.current.targetX = (clientX / rect.width - 0.5) * 2;
      mouseRef.current.targetY = (clientY / rect.height - 0.5) * 2;
    };

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);
    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // 9. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (carGroupRef.current && !prefersReducedMotion) {
        // Continuous slow orbit + scroll-based angle rotation
        const baseRotationY = Math.PI * 0.22 + scrollProgress * Math.PI * 0.8;
        carGroupRef.current.rotation.y = baseRotationY + mouseRef.current.x * 0.25;
        carGroupRef.current.rotation.x = mouseRef.current.y * 0.08;

        // Subtle aerodynamic suspension float
        carGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.03;
      }

      // Animate floating energy particles
      if (particlesRef.current && !prefersReducedMotion) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += delta * 0.35;
          if (positions[i] > 3) {
            positions[i] = 0;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y += delta * 0.08;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [interactive, prefersReducedMotion, showRings]);

  // Update body color when prop changes
  useEffect(() => {
    if (materialsRef.current.bodyMat) {
      materialsRef.current.bodyMat.color.set(carColor);
    }
  }, [carColor]);

  return (
    <div className={`relative w-full h-full min-h-[380px] overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing" />

      {/* Loading State Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050607]/80 backdrop-blur-sm transition-opacity duration-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <span className="text-xs text-slate-400 tracking-wider">INITIALIZING EV TELEMETRY SCENE</span>
          </div>
        </div>
      )}

      {/* WebGL Fallback if unsupported */}
      {!webglSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-white">Interactive 3D Engine Preview</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            High-performance WebGL rendering is disabled or unavailable. Telemetry models remain accessible.
          </p>
        </div>
      )}

      {/* Reusable Asset Badge notice */}
      <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D Studio Engine · {modelType === 'gltf' ? 'GLTF Asset' : 'Procedural EV Twin'}</span>
      </div>
    </div>
  );
};
