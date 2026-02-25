import * as THREE from "three";
import { ambient_light, light } from "./lights.js";
import {
  canvas,
  renderer,
  scene,
  camera,
  orbit_controls,
} from "./camera_controls.js";

export const piece_size = 1;
export const padding_size = 1;
export const n_pieces = 4;

import { create_board, create_rods } from "./board.js";

export function find_origin(piece_size, padding_size, n_pieces) {
  const total_width = (piece_size + padding_size) * (n_pieces - 1) + piece_size;
  const half_width = total_width / 2;
  return new THREE.Vector3(
    -half_width + piece_size / 2,
    0,
    -half_width + piece_size / 2,
  );
}

export function initGame() {
  //lighting

  scene.add(ambient_light);
  scene.add(light);

  //board
  const board = create_board(piece_size, padding_size, n_pieces);
  scene.add(board);

  const pieces_origin = find_origin(piece_size, padding_size, n_pieces);

  const rods = create_rods(piece_size, padding_size, n_pieces, pieces_origin);

  for (let i = 0; i < rods.length; i++) {
    scene.add(rods[i]);
  }

  let game_state = [];

  for (let height = 0; height < n_pieces; height++) {
    game_state.push([]);
    for (let row = 0; row < n_pieces; row++) {
      game_state[height].push([]);
      for (let col = 0; col < n_pieces; col++) {
        game_state[height][row].push(0);
      }
    }
  }

  console.log(game_state);

  // const pieces_origin = find_origin(piece_size, padding_size, n_pieces);
  // const piece_geometry = new THREE.SphereGeometry(piece_size / 2, 16, 8);
  // const piece_material_1 = new THREE.MeshStandardMaterial({
  //   color: THREE.Color.NAMES.greenyellow,
  // });
  // const piece_material_2 = new THREE.MeshStandardMaterial({
  //   color: THREE.Color.NAMES.blueviolet,
  // });

  // for (let height = 0; height < n_pieces; height++) {
  //   for (let row = 0; row < n_pieces; row++) {
  //     for (let col = 0; col < n_pieces; col++) {
  //       const material =
  //         (row + col + height) % 2 === 0 ? piece_material_1 : piece_material_2;

  //       const piece = new THREE.Mesh(piece_geometry, material);
  //       const x = pieces_origin.x + col * (piece_size + padding_size);
  //       const y = height * piece_size;
  //       const z = pieces_origin.z + row * (piece_size + padding_size);
  //       piece.position.set(x, y, z);
  //       scene.add(piece);
  //     }
  //   }
  // }

  function animate() {
    requestAnimationFrame(animate);
    orbit_controls.update(); // Update orbit controls
    renderer.render(scene, camera);
  }

  animate();
}
