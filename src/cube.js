import * as CANNON from "cannon-es";
import * as THREE from "three";
import * as Tone from "tone";
import { textures } from "./textures";

const CUBE_METALNESS = 0.9;
const CUBE_ROUGHNESS = 0.6;

export class Cube {
  constructor(
    size,
    color,
    material = null,
    position = [0, 0, 0],
    musicNote = "G4"
  ) {
    this.size = size;
    this.material = material;
    this.position = position;
    this.musicNote = musicNote;
    this.color = color;
    this.timeOutFunction = null;

    /**
     * Sounds
     */
    //create a synth and connect it to the main output (your speakers)
    this.synth = new Tone.Synth().toDestination();

    const geometry = new THREE.BoxGeometry(
      size * 2,
      size * 2,
      size * 2,
      100,
      100,
      100
    );
    const meshMaterial = new THREE.MeshStandardMaterial({
      metalness: CUBE_METALNESS,
      roughness: CUBE_ROUGHNESS,
      color: color
    });
    const mesh = new THREE.Mesh(geometry, meshMaterial);

    const halfExtents = new CANNON.Vec3(size, size, size);
    const boxShape = new CANNON.Box(halfExtents);
    const body = new CANNON.Body({
      mass: 1,
      shape: boxShape,
      material
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
    //this.mesh.material.metalness = 1;
    //this.mesh.material.roughness = 0;
    this.mesh.material.emissiveIntensity = 0.3;
    this.synth.triggerAttackRelease(this.musicNote, "8n");
    this.body.applyImpulse(new CANNON.Vec3(0, 3, 0));
  }

  deactivate() {
    this.timeOutFunction = setTimeout(() => {
      this.mesh.material.emissiveIntensity = 0;
    }, 200);
  }
}
