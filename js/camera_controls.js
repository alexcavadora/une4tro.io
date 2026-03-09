import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const canvas = document.getElementById("canvas");
export const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

export const scene = new THREE.Scene();

//camera and orbit controls
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 5, 10);

export const orbit_controls = new OrbitControls(camera, renderer.domElement);
orbit_controls.enablePan = false;
orbit_controls.minDistance = 6;
orbit_controls.maxDistance = 24;
orbit_controls.target.set(0, 0, 0);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
