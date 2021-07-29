import * as THREE from "three";
import { sceneObjects } from ".";

export const initLight = () => {
  // Light
  const ambiantLight = new THREE.AmbientLight(0xffffff, 0.3);
  const lightFolderGui = sceneObjects.gui.addFolder("Light");
  sceneObjects.scene.add(ambiantLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 5, 2);
  sceneObjects.scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xff9000, 0.8);
  pointLight.position.set(0, 3, -3);
  sceneObjects.scene.add(pointLight);

  lightFolderGui
    .add(ambiantLight, "intensity")
    .min(0)
    .max(2)
    .step(0.001)
    .name("Ambiant light intensity");
  lightFolderGui
    .add(directionalLight, "intensity")
    .min(0)
    .max(2)
    .step(0.001)
    .name("Directional light intensity");
};
