/**
 * The hero's 3D object: a live agent graph.
 *
 * Why this and not a decorative blob. The nodes are the actual components of an
 * agent runtime, the edges are the calls between them, and the pulses travelling
 * along those edges are requests in flight. Someone who builds these systems
 * reads the diagram in a second, which is the point of putting it in the hero
 * instead of a paragraph.
 *
 * Isolation rules this file obeys:
 *   - Three.js lives here and only here. No Motion components inside the Canvas.
 *   - Continuous values (pointer, scroll) arrive as MotionValues and are read
 *     inside useFrame. Nothing here touches React state per frame.
 *   - Node labels are plain DOM, positioned by projecting the node into screen
 *     space and writing a transform straight to the element. That keeps the
 *     whole drei dependency out of the bundle for what is really six spans.
 *   - Under prefers-reduced-motion the scene renders one static frame and stops.
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMotionValue, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import * as THREE from "three";

type NodeSpec = {
  id: string;
  label: string;
  position: [number, number, number];
  /** Labelled nodes are the readable ones; the rest are structural. */
  labelled: boolean;
};

/** The eight parts of the runtime, arranged so the graph reads from any angle. */
const NODES: NodeSpec[] = [
  { id: "agent", label: "AGENT", position: [0, 0, 0], labelled: true },
  { id: "llm", label: "LLM", position: [2.6, 1.5, -0.6], labelled: true },
  { id: "retriever", label: "RETRIEVER", position: [-2.7, 0.9, 0.8], labelled: true },
  { id: "vectors", label: "VECTOR STORE", position: [-3.4, -1.4, -0.9], labelled: true },
  { id: "tools", label: "TOOLS", position: [1.9, -1.9, 1.2], labelled: true },
  { id: "data", label: "DATA", position: [3.4, -0.7, 1.7], labelled: false },
  { id: "policy", label: "POLICY", position: [-0.9, 2.4, 1.4], labelled: false },
  { id: "approval", label: "APPROVAL", position: [0.4, -2.6, -1.3], labelled: true },
];

const LABELLED = NODES.map((node, index) => ({ node, index })).filter(
  ({ node }) => node.labelled,
);

/** Edges as index pairs into NODES. */
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 4],
  [0, 6],
  [0, 7],
  [2, 3],
  [4, 5],
  [6, 7],
  [1, 5],
  [3, 2],
];

const PULSES_PER_EDGE = 3;
const AMBIENT_COUNT = 420;

const nodeVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aGlow;
  uniform float uPixelRatio;
  varying float vGlow;

  void main() {
    vGlow = aGlow;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // aSize is in CSS pixels at the graph's resting depth. Multiplying by the
    // device pixel ratio keeps a node the same apparent size on every display.
    gl_PointSize = aSize * uPixelRatio * (6.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const nodeFragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  varying float vGlow;

  void main() {
    vec2 offset = gl_PointCoord - vec2(0.5);
    float dist = length(offset);
    if (dist > 0.5) discard;

    float core = 1.0 - smoothstep(0.16, 0.5, dist);
    float halo = (1.0 - smoothstep(0.0, 0.5, dist)) * 0.35 * vGlow;
    vec3 color = mix(uBase, uAccent, vGlow);
    float alpha = min(1.0, core * (0.55 + 0.45 * vGlow) + halo);
    gl_FragColor = vec4(color, alpha);
  }
`;

type LabelRefs = React.RefObject<(HTMLSpanElement | null)[]>;

function GraphScene({
  pointerX,
  pointerY,
  scrollProgress,
  reduced,
  labelRefs,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  reduced: boolean;
  labelRefs: LabelRefs;
}) {
  const group = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const ambientRef = useRef<THREE.Points>(null);
  const { camera, size, viewport } = useThree();

  /** Static geometry, built once. */
  const geometry = useMemo(() => {
    const nodePositions = new Float32Array(NODES.length * 3);
    const nodeSizes = new Float32Array(NODES.length);
    const nodeGlow = new Float32Array(NODES.length);

    NODES.forEach((node, i) => {
      nodePositions.set(node.position, i * 3);
      // The agent core is the largest, labelled nodes next, structural last.
      nodeSizes[i] = i === 0 ? 40 : node.labelled ? 26 : 17;
      nodeGlow[i] = i === 0 ? 1 : node.labelled ? 0.55 : 0.18;
    });

    const edgePositions = new Float32Array(EDGES.length * 6);
    EDGES.forEach(([a, b], i) => {
      edgePositions.set(NODES[a].position, i * 6);
      edgePositions.set(NODES[b].position, i * 6 + 3);
    });

    // One pulse buffer per edge, offset so they do not travel in lockstep.
    const pulseCount = EDGES.length * PULSES_PER_EDGE;
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseSizes = new Float32Array(pulseCount);
    const pulseGlow = new Float32Array(pulseCount);
    const pulseEdge = new Int16Array(pulseCount);
    const pulseOffset = new Float32Array(pulseCount);
    const pulseSpeed = new Float32Array(pulseCount);

    for (let i = 0; i < pulseCount; i++) {
      pulseEdge[i] = Math.floor(i / PULSES_PER_EDGE);
      pulseOffset[i] = (i % PULSES_PER_EDGE) / PULSES_PER_EDGE + Math.random() * 0.12;
      pulseSpeed[i] = 0.1 + Math.random() * 0.16;
      pulseSizes[i] = 9 + Math.random() * 5;
      pulseGlow[i] = 1;
    }

    // Ambient shell. Gives the graph something to sit inside so depth reads.
    const ambientPositions = new Float32Array(AMBIENT_COUNT * 3);
    const ambientSizes = new Float32Array(AMBIENT_COUNT);
    const ambientGlow = new Float32Array(AMBIENT_COUNT);

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const radius = 5.5 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      ambientPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      ambientPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      ambientPositions[i * 3 + 2] = radius * Math.cos(phi);
      ambientSizes[i] = 5 + Math.random() * 6;
      ambientGlow[i] = Math.random() < 0.08 ? 0.5 : 0;
    }

    return {
      nodePositions,
      nodeSizes,
      nodeGlow,
      edgePositions,
      pulseCount,
      pulsePositions,
      pulseSizes,
      pulseGlow,
      pulseEdge,
      pulseOffset,
      pulseSpeed,
      ambientPositions,
      ambientSizes,
      ambientGlow,
    };
  }, []);

  const uniforms = useMemo(
    () => ({
      uBase: { value: new THREE.Color("#9aa5b4") },
      uAccent: { value: new THREE.Color("#ffb020") },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  const pulseUniforms = useMemo(
    () => ({
      uBase: { value: new THREE.Color("#ffb020") },
      uAccent: { value: new THREE.Color("#ffd98a") },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  const damped = useRef({ x: 0, y: 0 });
  const projected = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    // delta is clamped: a backgrounded tab returns one enormous frame otherwise.
    const dt = Math.min(delta, 0.05);

    uniforms.uPixelRatio.value = viewport.dpr;
    pulseUniforms.uPixelRatio.value = viewport.dpr;

    if (group.current) {
      if (reduced) {
        group.current.rotation.set(-0.06, 0.42, 0);
      } else {
        const targetY = pointerX.get() * 0.5;
        const targetX = pointerY.get() * 0.3;
        damped.current.x += (targetX - damped.current.x) * Math.min(1, dt * 3);
        damped.current.y += (targetY - damped.current.y) * Math.min(1, dt * 3);

        group.current.rotation.y += dt * 0.07;
        group.current.rotation.x = damped.current.x - 0.06;
        group.current.rotation.z = damped.current.y * 0.12;
      }
    }

    if (!reduced) {
      // Camera travels into the graph as the hero scrolls away. Real Z depth,
      // not a parallax translate.
      const progress = Math.min(Math.max(scrollProgress.get(), 0), 1);
      camera.position.z = 9.4 - progress * 5.2;
      camera.position.y = progress * 0.9;
      camera.lookAt(0, 0, 0);

      // Pulses travel their edge, wrap, and repeat.
      const pulsePoints = pulseRef.current;
      if (pulsePoints) {
        const attr = pulsePoints.geometry.getAttribute("position") as THREE.BufferAttribute;
        const array = attr.array as Float32Array;

        for (let i = 0; i < geometry.pulseCount; i++) {
          geometry.pulseOffset[i] += geometry.pulseSpeed[i] * dt;
          if (geometry.pulseOffset[i] > 1) geometry.pulseOffset[i] -= 1;

          const [a, b] = EDGES[geometry.pulseEdge[i]];
          const from = NODES[a].position;
          const to = NODES[b].position;
          const t = geometry.pulseOffset[i];

          array[i * 3] = from[0] + (to[0] - from[0]) * t;
          array[i * 3 + 1] = from[1] + (to[1] - from[1]) * t;
          array[i * 3 + 2] = from[2] + (to[2] - from[2]) * t;
        }
        attr.needsUpdate = true;
      }

      if (ambientRef.current) {
        ambientRef.current.rotation.y -= dt * 0.02;
      }
    }

    // Project the labelled nodes into screen space and write the transform
    // directly to the DOM. No React render, no drei.
    const container = group.current;
    if (container) {
      container.updateMatrixWorld();
      LABELLED.forEach(({ node, index }, slot) => {
        const element = labelRefs.current[slot];
        if (!element) return;

        projected.set(...node.position).applyMatrix4(container.matrixWorld).project(camera);

        const x = (projected.x * 0.5 + 0.5) * size.width;
        const y = (-projected.y * 0.5 + 0.5) * size.height;

        // Fade labels that swing behind the graph so they never sit on top of it.
        const depth = projected.z;
        const visible = depth < 1 && depth > -1;
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        element.style.opacity = visible ? (index === 0 ? "1" : "0.72") : "0";
      });
    }
  });

  return (
    <group ref={group} scale={0.78}>
      <points ref={ambientRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geometry.ambientPositions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[geometry.ambientSizes, 1]} />
          <bufferAttribute attach="attributes-aGlow" args={[geometry.ambientGlow, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={nodeVertexShader}
          fragmentShader={nodeFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geometry.edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#3b4250" transparent opacity={0.9} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geometry.nodePositions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[geometry.nodeSizes, 1]} />
          <bufferAttribute attach="attributes-aGlow" args={[geometry.nodeGlow, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={nodeVertexShader}
          fragmentShader={nodeFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={pulseRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geometry.pulsePositions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[geometry.pulseSizes, 1]} />
          <bufferAttribute attach="attributes-aGlow" args={[geometry.pulseGlow, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={nodeVertexShader}
          fragmentShader={nodeFragmentShader}
          uniforms={pulseUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function AgentGraph() {
  const wrapper = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion() ?? false;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // Hero scroll progress. Motion reads this off its own rAF loop, so there is
  // no scroll listener and no per-frame React render.
  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ["start start", "end start"],
  });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      ref={wrapper}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 9.4], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
        style={{ background: "transparent" }}
      >
        <GraphScene
          pointerX={pointerX}
          pointerY={pointerY}
          scrollProgress={scrollYProgress}
          reduced={reduced}
          labelRefs={labelRefs}
        />
      </Canvas>

      {/* Labels live outside the canvas, hidden below md where the graph is
          background texture rather than a diagram. */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {LABELLED.map(({ node }, slot) => (
          <span
            key={node.id}
            ref={(element) => {
              labelRefs.current[slot] = element;
            }}
            className="tabular absolute left-0 top-0 whitespace-nowrap pl-3 text-[10px] tracking-[0.16em] text-muted opacity-0 will-change-transform"
          >
            {node.label}
          </span>
        ))}
      </div>
    </div>
  );
}
