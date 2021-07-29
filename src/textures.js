import * as THREE from "three";
// Wall
import wallDiffuseTexture from "./assets/wood-wall/wood-wall-diffuse.jpg";
import wallHeightTexture from "./assets/wood-wall/wood-wall-height.png";
import wallAoTexture from "./assets/wood-wall/wood-wall-ao.jpg";
import wallRoughnessTexture from "./assets/wood-wall/wood-wall-roughness.jpg";
// Ground
//import groundDiffuseTexture from "./assets/ground-leaves/ground-leaves-diffuse.jpg";
//import groundHeightTexture from "./assets/ground-leaves/ground-leaves-height.png";
//import groundAoTexture from "./assets/ground-leaves/ground-leaves-ao.jpg";

import groundDiffuseTexture from "./assets/ground-tiles/floor_tiles_diff.jpg";
import groundAoTexture from "./assets/ground-tiles/floor_tiles_ao.jpg";

import glowTexture from "./assets/glow.png";

//Envmap
import envmap1Px from "./assets/environment-maps/1/px.png";
import envmap1Nx from "./assets/environment-maps/1/nx.png";
import envmap1Py from "./assets/environment-maps/1/py.png";
import envmap1Ny from "./assets/environment-maps/1/ny.png";
import envmap1Pz from "./assets/environment-maps/1/pz.png";
import envmap1Nz from "./assets/environment-maps/1/nz.png";
import envmap2Px from "./assets/environment-maps/2/px.png";
import envmap2Nx from "./assets/environment-maps/2/nx.png";
import envmap2Py from "./assets/environment-maps/2/py.png";
import envmap2Ny from "./assets/environment-maps/2/ny.png";
import envmap2Pz from "./assets/environment-maps/2/pz.png";
import envmap2Nz from "./assets/environment-maps/2/nz.png";
import envmap3Px from "./assets/environment-maps/3/px.png";
import envmap3Nx from "./assets/environment-maps/3/nx.png";
import envmap3Py from "./assets/environment-maps/3/py.png";
import envmap3Ny from "./assets/environment-maps/3/ny.png";
import envmap3Pz from "./assets/environment-maps/3/pz.png";
import envmap3Nz from "./assets/environment-maps/3/nz.png";
import envmap4Px from "./assets/environment-maps/4/px.png";
import envmap4Nx from "./assets/environment-maps/4/nx.png";
import envmap4Py from "./assets/environment-maps/4/py.png";
import envmap4Ny from "./assets/environment-maps/4/ny.png";
import envmap4Pz from "./assets/environment-maps/4/pz.png";
import envmap4Nz from "./assets/environment-maps/4/nz.png";

export const textures = {};
/**
 * Loader
 */
const textureLoader = new THREE.TextureLoader();

// Glow
textures.glowTexture = textureLoader.load(glowTexture);

// Walls
textures.wallDiffuseTexture = textureLoader.load(wallDiffuseTexture);
textures.wallHeightTexture = textureLoader.load(wallHeightTexture);
textures.wallAoTexture = textureLoader.load(wallAoTexture);
textures.wallRoughnessTexture = textureLoader.load(wallRoughnessTexture);

// Ground
textures.groundDiffuseTexture = textureLoader.load(groundDiffuseTexture);
//textures.groundHeightTexture = textureLoader.load(groundHeightTexture);
textures.groundAoTexture = textureLoader.load(groundAoTexture);

textures.groundDiffuseTexture.wrapS = THREE.RepeatWrapping;
textures.groundDiffuseTexture.wrapT = THREE.RepeatWrapping;
textures.groundDiffuseTexture.repeat.set(6, 6);

const cubeTextureLoader = new THREE.CubeTextureLoader();
export const environmentMapTexture1 = cubeTextureLoader.load([
  envmap1Px,
  envmap1Nx,
  envmap1Py,
  envmap1Ny,
  envmap1Pz,
  envmap1Nz
]);

export const environmentMapTexture2 = cubeTextureLoader.load([
  envmap2Px,
  envmap2Nx,
  envmap2Py,
  envmap2Ny,
  envmap2Pz,
  envmap2Nz
]);

export const environmentMapTexture3 = cubeTextureLoader.load([
  envmap3Px,
  envmap3Nx,
  envmap3Py,
  envmap3Ny,
  envmap3Pz,
  envmap3Nz
]);

export const environmentMapTexture4 = cubeTextureLoader.load([
  envmap4Px,
  envmap4Nx,
  envmap4Py,
  envmap4Ny,
  envmap4Pz,
  envmap4Nz
]);
