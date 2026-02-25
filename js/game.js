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
let player_1_score = 0;
let player_2_score = 0;
let turn = 0;
let score_changed = false;
let current_height = 0;
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
  play_piece(0, 1);

  play_piece(1, 0);
  play_piece(1, 1);

  play_piece(2, 0);
  play_piece(2, 1);

  play_piece(3, 0);
  play_piece(3, 1);

  play_piece(2, 0);
  play_piece(2, 1);

  play_piece(3, 0);
  play_piece(3, 1);

  play_piece(2, 0);
  play_piece(2, 1);

  play_piece(3, 0);
  play_piece(3, 1);

  play_piece(3, 0);
  play_piece(3, 1);

  play_piece(1, 0);
  play_piece(1, 1);

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
  update_score();
  change_player_turn();
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

function update_score() {
  console.log("turn: " + turn);
  const prev_player_1_score = player_1_score;
  const prev_player_2_score = player_2_score;

  const [sc1, sc2] = check_straight_cols();
  player_1_score = sc1;
  player_2_score = sc2;

  const [sr1, sr2] = check_straight_rows();
  player_1_score += sr1;
  player_2_score += sr2;

  const [pil1, pil2] = check_pillars();
  player_1_score += pil1;
  player_2_score += pil2;

  const [stc1, stc2] = check_stairs_col_wise();
  player_1_score += stc1;
  player_2_score += stc2;

  const [str1, str2] = check_stairs_row_wise();
  player_1_score += str1;
  player_2_score += str2;

  if (
    prev_player_1_score != player_1_score ||
    prev_player_2_score != player_1_score
  ) {
    console.log("P1 : " + player_1_score);
    console.log("P2 : " + player_2_score);
  }
  turn += 1;
}

function check_straight_cols() {
  let p1_found = 0;
  let p2_found = 0;
  for (let height = 0; height < current_height; height++) {
    for (let row = 0; row < n_pieces; row++) {
      let p1_connected = 0;
      let p2_connected = 0;

      for (let col = 0; col < n_pieces; col++) {
        if (game_state[row][col][height] == 0) break;
        else if (game_state[row][col][height] == 1) p1_connected += 1;
        else p2_connected += 1;
      }

      if (p1_connected == n_pieces) {
        p1_found += 1;
        console.log("found p1 straight col");
      }
      if (p2_connected == n_pieces) {
        p2_found += 1;
        console.log("found p2 straight col");
      }
    }
  }
  return [p1_found, p2_found];
}

function check_straight_rows() {
  let p1_found = 0;
  let p2_found = 0;
  for (let height = 0; height < current_height; height++) {
    for (let col = 0; col < n_pieces; col++) {
      let p1_connected = 0;
      let p2_connected = 0;

      for (let row = 0; row < n_pieces; row++) {
        if (game_state[row][col][height] == 0) break;
        else if (game_state[row][col][height] == 1) p1_connected += 1;
        else p2_connected += 1;
      }

      if (p1_connected == n_pieces) {
        p1_found += 1;
        console.log("found p1 straight row");
      }
      if (p2_connected == n_pieces) {
        p2_found += 1;
        console.log("found p2 straight row");
      }
    }
  }
  return [p1_found, p2_found];
}

function check_pillars() {
  if (current_height < n_pieces) return [0, 0];
  let p1_found = 0;
  let p2_found = 0;

  for (let row = 0; row < n_pieces; row++) {
    for (let col = 0; col < n_pieces; col++) {
      let p1_connected = 0;
      let p2_connected = 0;

      for (let height = 0; height < n_pieces; height++) {
        if (game_state[row][col][height] == 0) break;
        else if (game_state[row][col][height] == 1) p1_connected += 1;
        else p2_connected += 1;
      }

      if (p1_connected == n_pieces) {
        p1_found += 1;
        console.log("found p1 pillar");
      }
      if (p2_connected == n_pieces) {
        p2_found += 1;
        console.log("found p2 pillar");
      }
    }
  }
  return [p1_found, p2_found];
}

function check_stairs_col_wise() {
  if (current_height < n_pieces) return [0, 0];
  let p1_found = 0;
  let p2_found = 0;

  for (let row = 0; row < n_pieces; row++) {
    let p1_connected = 0;
    let p2_connected = 0;
    for (let col = 0; col < n_pieces; col++) {
      if (game_state[row][col][col] == 0) break;
      else if (game_state[row][col][col] == 1) p1_connected += 1;
      else p2_connected += 1;
    }
    if (p1_connected == n_pieces) {
      p1_found += 1;
      console.log("found p1 col stair");
    }
    if (p2_connected == n_pieces) {
      p2_found += 1;
      console.log("found p2 col stair");
    }

    p1_connected = 0;
    p2_connected = 0;

    for (let col = 0; col < n_pieces; col++) {
      if (game_state[row][n_pieces - col - 1][col] == 0) break;
      else if (game_state[row][n_pieces - col - 1][col] == 1) p1_connected += 1;
      else p2_connected += 1;
    }
    if (p1_connected == n_pieces) {
      p1_found += 1;
      console.log("found p1 col stair");
    }
    if (p2_connected == n_pieces) {
      p2_found += 1;
      console.log("found p2 col stair");
    }
  }

  return [p1_found, p2_found];
}

function check_stairs_row_wise() {
  if (current_height < n_pieces) return [0, 0];

  let p1_found = 0;
  let p2_found = 0;

  for (let col = 0; col < n_pieces; col++) {
    let p1_connected = 0;
    let p2_connected = 0;
    for (let row = 0; row < n_pieces; row++) {
      if (game_state[row][col][row] == 0) break;
      else if (game_state[row][col][row] == 1) p1_connected += 1;
      else p2_connected += 1;
    }
    if (p1_connected == n_pieces) {
      p1_found += 1;
      console.log("found p1 row stair");
    }
    if (p2_connected == n_pieces) {
      p2_found += 1;
      console.log("found p2 row stair");
    }

    p1_connected = 0;
    p2_connected = 0;

    for (let row = 0; row < n_pieces; row++) {
      if (game_state[n_pieces - row - 1][col][row] == 0) break;
      else if (game_state[n_pieces - row - 1][col][row] == 1) p1_connected += 1;
      else p2_connected += 1;
    }
    if (p1_connected == n_pieces) {
      p1_found += 1;
      console.log("found p1 row stair");
    }
    if (p2_connected == n_pieces) {
      p2_found += 1;
      console.log("found p2 row stair");
    }
  }

  return [p1_found, p2_found];
}

function check_stairs_diagonal() {
  if (current_height < n_pieces) return [0, 0];

  let p1_found = 0;
  let p2_found = 0;

  let p1_connected = 0;
  let p2_connected = 0;

  for (let idx = 0; idx < n_pieces; idx++) {
    if (game_state[idx][idx][idx] == 0) break;
    else if ((game_state[idx][idx][idx] = 1)) p1_connected += 1;
    else p2_connected += 1;
  }

  if (p1_connected == n_pieces) {
    p1_found += 1;
    console.log("found p1 diagonal stair");
  }
  if (p2_connected == n_pieces) {
    p2_found += 1;
    console.log("found p2 diagonal stair");
  }

  return [p1_found, p2_found];
}
