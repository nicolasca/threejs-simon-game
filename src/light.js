import * as THREE from "three";
import { sceneObjects } from ".";

export const initLight = () => {
  // Light
  const ambiantLight = new THREE.AmbientLight(0xffffff, 0.2);
  const lightFolderGui = sceneObjects.gui.addFolder("Light");
  sceneObjects.scene.add(ambiantLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 5, 2);
  sceneObjects.scene.add(directionalLight);

  const COLOR_BACK_LIGHT = 0x3333d7;
  const pointLightBack = new THREE.PointLight(COLOR_BACK_LIGHT, 0.6);
  pointLightBack.position.set(0, 3, -2);
  sceneObjects.scene.add(pointLightBack);

  const COLOR_FRONT_LIGHT = 0xed6a7c;
  const pointLightFront = new THREE.PointLight(COLOR_FRONT_LIGHT, 0.6);
  pointLightBack.position.set(0, 3, 2);
  sceneObjects.scene.add(pointLightFront);

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

  var params = {
    colorBack: COLOR_BACK_LIGHT,
    colorFront: COLOR_FRONT_LIGHT
  };
  lightFolderGui
    .addColor(params, "colorBack")
    .name("Back color")
    .onChange(function () {
      pointLightBack.color.set(params.colorBack);
    });

  lightFolderGui
    .addColor(params, "colorFront")
    .name("Front color")
    .onChange(function () {
      pointLightFront.color.set(params.colorFront);
    });
};
