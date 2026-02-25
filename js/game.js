import * as THREE from "three";
import {ambient_light, light} from "./lights.js"
import {canvas, renderer, scene, camera, controls} from "./camera_controls.js"

export const piece_size = 1;
export const padding_size = 1;
export const n_pieces = 4;

import {rods, board, find_origin} from "./board.js"

export function initGame() {

  //lighting
  
  scene.add(ambient_light);
  scene.add(light);
  
  //board
  scene.add(board);

  console.log(rods)


  const pieces_origin = find_origin(piece_size, padding_size, n_pieces);
  const piece_geometry = new THREE.SphereGeometry(piece_size / 2, 16, 8);
  const piece_material_1 = new THREE.MeshStandardMaterial({
    color: THREE.Color.NAMES.greenyellow,
  });
  const piece_material_2 = new THREE.MeshStandardMaterial({
    color: THREE.Color.NAMES.blueviolet,
  });

  let game_state = []

  for (let height = 0; height < n_pieces; height++) {
    game_state.push([])
    for (let row = 0; row < n_pieces; row++) {
      game_state[height].push([])
      for (let col = 0; col < n_pieces; col++) {
        game_state[height][row].push(0)
      }
    }
  }

  console.log(game_state)

  for (let height = 0; height < n_pieces; height++) {
    for (let row = 0; row < n_pieces; row++) {
      for (let col = 0; col < n_pieces; col++) {
        const material =
          (row + col + height) % 2 === 0 ? piece_material_1 : piece_material_2;

        const piece = new THREE.Mesh(piece_geometry, material);
        const x = pieces_origin.x + col * (piece_size + padding_size);
        const y = height * piece_size;
        const z = pieces_origin.z + row * (piece_size + padding_size);
        piece.position.set(x, y, z);
        scene.add(piece);
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update orbit controls
    renderer.render(scene, camera);
  }

  animate();

}
