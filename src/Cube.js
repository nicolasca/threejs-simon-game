import * as CANNON from "cannon-es";
import * as THREE from "three";
import * as Tone from "tone";

export class Cube {
  constructor(
    size,
    color,
    material = null,
    position = [0, 0, 0],
    musicNote = "G4"
  ) {
    this.size = size;
    this.color = color;
    this.material = material;
    this.position = position;
    this.musicNote = musicNote;

    /**
     * Sounds
     */
    //create a synth and connect it to the main output (your speakers)
    this.synth = new Tone.Synth().toDestination();

    const geometry = new THREE.BoxGeometry();
    const meshMaterial = new THREE.MeshStandardMaterial({
      color
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
    this.mesh.material.color.set("yellow");
    this.synth.triggerAttackRelease(this.musicNote, "8n");
    this.body.applyImpulse(new CANNON.Vec3(0, 3, 0));
  }

  deactivate() {
    console.log(this.color);

    this.mesh.material.color.set(this.color);
  }
}
