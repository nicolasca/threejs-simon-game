import * as CANNON from "cannon-es";
import { sceneObjects } from ".";
import { Cube } from "./cube";

const CUBE_1_COLOR = 0xde2f2f;
const CUBE_2_COLOR = 0x26cf;
const CUBE_3_COLOR = 0xb60663;
const CUBE_4_COLOR = 0x724b04;

export const createCubes = () => {
  // Create the objects
  const plasticMaterial = new CANNON.Material("plastic");
  const cube1 = new Cube(0.5, CUBE_1_COLOR, plasticMaterial, [-3, 1, 0], "G4");
  const cube2 = new Cube(0.5, CUBE_2_COLOR, plasticMaterial, [-1, 1, 0], "A4");
  const cube3 = new Cube(0.5, CUBE_3_COLOR, plasticMaterial, [1, 1, 0], "B4");
  const cube4 = new Cube(0.5, CUBE_4_COLOR, plasticMaterial, [3, 1, 0], "C5");

  // Add events
  document.addEventListener("keydown", (e) => {
    if (e.key === "a") {
      cube1.activate();
    } else if (e.key === "z") {
      cube2.activate();
    } else if (e.key === "e") {
      cube3.activate();
    } else if (e.key === "r") {
      cube4.activate();
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "a") {
      cube1.deactivate();
    } else if (e.key === "z") {
      cube2.deactivate();
    } else if (e.key === "e") {
      cube3.deactivate();
    } else if (e.key === "r") {
      cube4.deactivate();
    }
  });

  const cubes = [cube1, cube2, cube3, cube4];

  return cubes;
};
