import * as CANNON from "cannon-es";
import * as THREE from "three";
import * as Tone from "tone";
import { environmentMapTexture } from "./textures";

const SPHERE_METALNESS = 0.7;
const SPHERE_ROUGHNESS = 0.2;

export class Cube {
  constructor(
    size,
    material = null,
    position = [0, 0, 0],
    musicNote = "G4",
    envMapTexture
  ) {
    this.size = size;
    this.material = material;
    this.position = position;
    this.musicNote = musicNote;
    this.timeOutFunction = null;

    /**
     * Sounds
     */
    //create a synth and connect it to the main output (your speakers)
    this.synth = new Tone.Synth().toDestination();

    // const geometry = new THREE.BoxGeometry(
    //   size * 2,
    //   size * 2,
    //   size * 2,
    //   100,
    //   100,
    //   100
    // );
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const meshMaterial = new THREE.MeshStandardMaterial({
      metalness: SPHERE_METALNESS,
      roughness: SPHERE_ROUGHNESS,
      envMap: envMapTexture,
    });
    const mesh = new THREE.Mesh(geometry, meshMaterial);

    const halfExtents = new CANNON.Vec3(size, size, size);
    const boxShape = new CANNON.Box(halfExtents);
    const body = new CANNON.Body({
      mass: 1,
      shape: boxShape,
      material,
    });
    body.position.x = position[0];
    body.position.y = position[1];
    body.position.z = position[2];

    this.mesh = mesh;
    this.body = body;
  }

  updateMeshPosition() {
    this.mesh.position.copy(this.body.position);
  }

  updateMeshRotation() {
    this.mesh.quaternion.copy(this.body.quaternion);
  }

  activate() {
    clearTimeout(this.timeOutFunction);
    this.mesh.material.metalness = 1;
    this.mesh.material.roughness = 0;
    this.synth.triggerAttackRelease(this.musicNote, "8n");
    this.body.applyImpulse(new CANNON.Vec3(0, 3, 0));
  }

  deactivate() {
    this.timeOutFunction = setTimeout(() => {
      this.mesh.material.metalness = SPHERE_METALNESS;
      this.mesh.material.roughness = SPHERE_ROUGHNESS;
    }, 200);
  }
}
