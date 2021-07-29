import * as THREE from "three";
import { textures } from "./textures";

const WALL_DEPTH = 0.1;
const WALL_HEIGHT = 5;

const wallGeometry = new THREE.PlaneGeometry(10, WALL_HEIGHT);

const createMaterial = (metalness, roughness) => {
  return new THREE.MeshStandardMaterial({
    map: textures.wallDiffuseTexture,
    displacementMap: textures.wallHeightTexture,
    aoMap: textures.wallAoTexture,
    metalness: metalness,
    roughness: roughness,
    displacementScale: 0.2
    // roughnessMap: wallRoughnessTexture
  });
};

// Create the walls
const materialLeft = createMaterial(0.4, 1);
export const wallMeshLeft = new THREE.Mesh(wallGeometry, materialLeft);
wallMeshLeft.position.x = -5 - WALL_DEPTH;
wallMeshLeft.position.y = WALL_HEIGHT / 2;
wallMeshLeft.rotation.y = Math.PI / 2;

const materialRight = createMaterial(0.4, 1);
export const wallMeshRight = new THREE.Mesh(wallGeometry, materialRight);
wallMeshRight.position.x = 5 + WALL_DEPTH;
wallMeshRight.position.y = WALL_HEIGHT / 2;
wallMeshRight.rotation.y = -Math.PI / 2;
wallMeshRight.material.metalness = 0.4;
wallMeshRight.material.roughness = 1;

const materialBack = createMaterial(0, 0.4);
export const wallMeshBack = new THREE.Mesh(wallGeometry, materialBack);
wallMeshBack.position.z = -5 - WALL_DEPTH;
wallMeshBack.position.y = WALL_HEIGHT / 2;
