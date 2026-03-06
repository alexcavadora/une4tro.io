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
import { update_score } from "./score_updater.js";

//input
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

//settings
export const piece_size = 1;
export const padding_size = 1;
export const n_pieces = 4;
export const pieces_origin = find_origin(piece_size, padding_size, n_pieces);

// game objects
const rods = create_rods(piece_size, padding_size, n_pieces, pieces_origin);
const board = create_board(piece_size, padding_size, n_pieces);

//game variables
let player_turn = 1;
export let game_state = [];
let mesh_pieces = [];
let player_1_score = 0;
let player_2_score = 0;

export let current_height = 0;

//setup scene
export function initGame() {
  renderer.domElement.addEventListener("pointerup", onPointerUp, false);

  //lighting
  scene.add(ambient_light);
  scene.add(light);

  //board
  scene.add(board);

  //rods

  for (let row = 0; row < n_pieces; row++)
    for (let col = 0; col < n_pieces; col++) {
      scene.add(rods[n_pieces * row + col]);
      rods[n_pieces * row + col].userData = { row, col };
    }
  //empty board state
  init_board();
  //console.log(game_state);

  //update func
  function animate() {
    requestAnimationFrame(animate);
    orbit_controls.update();
    renderer.render(scene, camera);
  }

  animate();
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
  [player_1_score, player_2_score] = update_score();
  console.log("P1 : " + player_1_score);
  console.log("P2 : " + player_2_score);
  change_player_turn();
}

function onPointerUp(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(rods);

  if (intersects.length > 0) {
    const rod = intersects[0].object;
    const { row, col } = rod.userData;
    play_piece(row, col);
  }
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

function find_height(row, col) {
  let height = 0;
  for (height = 0; height < n_pieces; height++) {
    if (game_state[row][col][height] == 0) break;
  }
  if (height + 1 > current_height) current_height = height + 1;
  return height;
}

function change_player_turn() {
  if (player_turn == 1) player_turn = 2;
  else player_turn = 1;
}
