import * as THREE from "three";
import { textures } from "./textures";

const WALL_HEIGHT = 5;

const wallGeometrySides = new THREE.PlaneGeometry(5, WALL_HEIGHT);
const wallGeometryBack = new THREE.PlaneGeometry(10, WALL_HEIGHT);

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
const materialLeft = createMaterial(0.8, 1);
export const wallMeshLeft = new THREE.Mesh(wallGeometrySides, materialLeft);
wallMeshLeft.position.x = -5;
wallMeshLeft.position.y = WALL_HEIGHT / 2;
wallMeshLeft.rotation.y = Math.PI / 2;

const materialRight = createMaterial(0.8, 1);
export const wallMeshRight = new THREE.Mesh(wallGeometrySides, materialRight);
wallMeshRight.position.x = 5;
wallMeshRight.position.y = WALL_HEIGHT / 2;
wallMeshRight.rotation.y = -Math.PI / 2;
wallMeshRight.material.metalness = 0.4;
wallMeshRight.material.roughness = 1;

const materialBack = createMaterial(0, 0.5);
export const wallMeshBack = new THREE.Mesh(wallGeometryBack, materialBack);
wallMeshBack.position.z = -2.5;
wallMeshBack.position.y = WALL_HEIGHT / 2;

const materialFront = createMaterial(0, 0.5);
export const wallMeshFront = new THREE.Mesh(wallGeometryBack, materialFront);
wallMeshFront.position.z = 2.5;
wallMeshFront.position.y = WALL_HEIGHT / 2;
wallMeshFront.rotation.x = Math.PI;
