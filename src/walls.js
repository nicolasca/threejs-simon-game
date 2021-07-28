import * as THREE from "three";
import { textures } from "./textures";

const WALL_DEPTH = 0.1;
const WALL_HEIGHT = 5;

const wallGeometry = new THREE.PlaneGeometry(10, WALL_HEIGHT);
export const wallMaterial = new THREE.MeshStandardMaterial({
  map: textures.wallDiffuseTexture,
  displacementMap: textures.wallHeightTexture,
  aoMap: textures.wallAoTexture,
  // roughnessMap: wallRoughnessTexture
});
wallMaterial.displacementScale = 0.1;

// Create the walls
export const wallMeshLeft = new THREE.Mesh(wallGeometry, wallMaterial);
wallMeshLeft.position.x = -5 - WALL_DEPTH;
wallMeshLeft.position.y = WALL_HEIGHT / 2;
wallMeshLeft.rotation.y = Math.PI / 2;

export const wallMeshRight = new THREE.Mesh(wallGeometry, wallMaterial);
wallMeshRight.position.x = 5 + WALL_DEPTH;
wallMeshRight.position.y = WALL_HEIGHT / 2;
wallMeshRight.rotation.y = -Math.PI / 2;

export const wallMeshBack = new THREE.Mesh(wallGeometry, wallMaterial);
wallMeshBack.position.z = -5 - WALL_DEPTH;
wallMeshBack.position.y = WALL_HEIGHT / 2;
