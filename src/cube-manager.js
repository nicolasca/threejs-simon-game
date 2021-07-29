import * as CANNON from "cannon-es";
import { Cube } from "./cube";

export const createCubes = () => {
  // Create the objects
  const plasticMaterial = new CANNON.Material("plastic");
  const cube1 = new Cube(0.5, plasticMaterial, [-3, 1, 0], "G4");
  const cube2 = new Cube(0.5, plasticMaterial, [-1, 1, 0], "A4");
  const cube3 = new Cube(0.5, plasticMaterial, [1, 1, 0], "B4");
  const cube4 = new Cube(0.5, plasticMaterial, [3, 1, 0], "C5");

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

  return [cube1, cube2, cube3, cube4];
};
