import { initLight } from "./light";
import { initScene, startAnimate } from "./scene-manager";

export const sceneObjects = initScene();
initLight();
startAnimate();
