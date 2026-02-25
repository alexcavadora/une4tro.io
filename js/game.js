import * as THREE from "three";
import { ambient_light, light } from "./lights.js";
import {
  canvas,
  renderer,
  scene,
  camera,
  orbit_controls,
} from "./camera_controls.js";
import { create_board, create_rods } from "./board.js";
import { place_piece_mesh } from "./pieces.js";

//settings
export const piece_size = 1;
export const padding_size = 1;
export const n_pieces = 4;
export const pieces_origin = find_origin(piece_size, padding_size, n_pieces);

//game variables
let player_turn = 1;
let game_state = [];
let mesh_pieces = [];

//setup scene
export function initGame() {
  //lighting
  scene.add(ambient_light);
  scene.add(light);

  //board
  const board = create_board(piece_size, padding_size, n_pieces);
  scene.add(board);

  //rods
  const rods = create_rods(piece_size, padding_size, n_pieces, pieces_origin);

  for (let i = 0; i < rods.length; i++) {
    scene.add(rods[i]);
  }

  //empty board state
  init_board();
  //console.log(game_state);

  // make moves
  play_piece(0, 0);
  play_piece(2, 2);
  play_piece(2, 2);
  play_piece(2, 2);
  play_piece(2, 2);
  play_piece(3, 3);
  play_piece(3, 3);
  play_piece(1, 1);
  play_piece(1, 2);
  play_piece(2, 2);
  play_piece(0, 3);

  //update camera
  function animate() {
    requestAnimationFrame(animate);
    orbit_controls.update(); // Update orbit controls
    renderer.render(scene, camera);
  }

  animate();
}

function init_board() {
  for (let height = 0; height < n_pieces; height++) {
    game_state.push([]);
    for (let row = 0; row < n_pieces; row++) {
      game_state[height].push([]);
      for (let col = 0; col < n_pieces; col++) {
        game_state[height][row].push(0);
      }
    }
  }
}

function find_origin(piece_size, padding_size, n_pieces) {
  const total_width = (piece_size + padding_size) * (n_pieces - 1) + piece_size;
  const half_width = total_width / 2;
  return new THREE.Vector3(
    -half_width + piece_size / 2,
    0,
    -half_width + piece_size / 2,
  );
}

export function play_piece(row, col) {
  const height = find_height(row, col);
  if (height == n_pieces) {
    return;
  }
  game_state[row][col][height] = player_turn;
  const piece = place_piece_mesh(row, col, height, player_turn);
  mesh_pieces.push(piece);
  scene.add(piece);
  change_player_turn();
}

function find_height(row, col) {
  let height = 0;
  for (height = 0; height < n_pieces; height++) {
    if (game_state[row][col][height] == 0) break;
  }
  return height;
}

function change_player_turn() {
  if (player_turn == 1) player_turn = 2;
  else player_turn = 1;
}
