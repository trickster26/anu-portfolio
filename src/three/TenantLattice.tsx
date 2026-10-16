/**
 * Second 3D beat, for the multi-tenancy section.
 *
 * A lattice of separated cells, one per tenant. Exactly one cell is lit at any
 * moment and the light never bridges two cells, which is the visual form of the
 * claim the section makes in words: isolation is structural, not enforced by a
 * WHERE clause. Instanced, so the lattice is two draw calls total.
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useInView, useMotionValue, useReducedMotion } from "motion/react";
import * as THREE from "three";

const COLS = 7;
const ROWS = 4;
const COUNT = COLS * ROWS;
const GAP = 1.25;
const STEP_SECONDS = 1.1;

const BASE_COLOR = new THREE.Color("#161a21");
const LIT_COLOR = new THREE.Color("#ffb020");

type Pointer = ReturnType<typeof useMotionValue<number>>;

function Lattice({
  pointerX,
  pointerY,
  reduced,
}: {
  pointerX: Pointer;
  pointerY: Pointer;
  reduced: boolean;
}) {
  const cells = useRef<THREE.InstancedMesh>(null);
  const outlines = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const damped = useRef({ x: -0.18, y: -0.42 });
  const scratch = useMemo(() => new THREE.Color(), []);

  const matrices = useMemo(() => {
    const dummy = new THREE.Object3D();
    return Array.from({ length: COUNT }, (_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      dummy.position.set(
        (col - (COLS - 1) / 2) * GAP,
        (row - (ROWS - 1) / 2) * GAP,
        // Slight depth variation so the lattice is not a flat wall.
        Math.sin(col * 1.7 + row * 0.9) * 0.35,
      );
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      return dummy.matrix.clone();
    });
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const mesh = cells.current;
    if (!mesh) return;

    // Seed matrices and colours once, on the first frame both meshes exist.
    if (!mesh.userData.seeded) {
      matrices.forEach((matrix, i) => {
        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, BASE_COLOR);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      if (outlines.current) {
        matrices.forEach((matrix, i) => outlines.current!.setMatrixAt(i, matrix));
        outlines.current.instanceMatrix.needsUpdate = true;
      }
      mesh.userData.seeded = true;
    }

    if (reduced) {
      if (!mesh.userData.staticLit) {
        mesh.setColorAt(9, LIT_COLOR);
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        mesh.userData.staticLit = true;
      }
    } else {
      elapsed.current += dt;
      const active = Math.floor(elapsed.current / STEP_SECONDS) % COUNT;
      const phase = (elapsed.current % STEP_SECONDS) / STEP_SECONDS;
      // The cell fades up and back down inside its own slot, so at no point are
      // two cells lit together.
      const intensity = Math.sin(phase * Math.PI);
      const previous = (active - 1 + COUNT) % COUNT;

      scratch.copy(BASE_COLOR);
      mesh.setColorAt(previous, scratch);
      scratch.copy(BASE_COLOR).lerp(LIT_COLOR, intensity);
      mesh.setColorAt(active, scratch);
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    if (group.current) {
      if (reduced) {
        group.current.rotation.set(-0.18, -0.42, 0);
      } else {
        const targetX = -0.18 + pointerY.get() * 0.16;
        const targetY = -0.42 + pointerX.get() * 0.22;
        damped.current.x += (targetX - damped.current.x) * Math.min(1, dt * 2.6);
        damped.current.y += (targetY - damped.current.y) * Math.min(1, dt * 2.6);
        group.current.rotation.x = damped.current.x;
        group.current.rotation.y = damped.current.y;
      }
    }
  });

  return (
    <group ref={group}>
      <instancedMesh ref={cells} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[0.9, 0.9, 0.14]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* A slightly larger, dimmer plate behind each cell reads as a border.
          A wireframe box was the obvious choice and the wrong one: it draws the
          triangulation diagonals across every face. */}
      <instancedMesh ref={outlines} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[1.06, 1.06, 0.08]} />
        <meshBasicMaterial color="#272d38" transparent opacity={0.9} />
      </instancedMesh>
    </group>
  );
}

export default function TenantLattice() {
  const wrapper = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  // Only animate while the section is on screen.
  const inView = useInView(wrapper);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  };

  return (
    <div
      ref={wrapper}
      className="absolute inset-0"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced || !inView ? "demand" : "always"}
        style={{ background: "transparent" }}
      >
        <Lattice pointerX={pointerX} pointerY={pointerY} reduced={reduced} />
      </Canvas>
    </div>
  );
}
