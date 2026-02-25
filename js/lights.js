import * as THREE from "three";
export const ambient_light = new THREE.AmbientLight(0xffffff, 0.5);
export const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(3, 4, 5);