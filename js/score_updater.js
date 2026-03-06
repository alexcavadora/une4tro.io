import { current_height, n_pieces, game_state } from "./game.js";

let turn = 0;
let score_changed = false;

export function update_score() {
  console.log("turn: " + turn);

  let p1_total = 0;
  let p2_total = 0;

  const [sc1, sc2] = check_straight_cols();
  p1_total += sc1;
  p2_total += sc2;

  const [sr1, sr2] = check_straight_rows();
  p1_total += sr1;
  p2_total += sr2;

  const [di1, di2] = check_diagonals();
  p1_total += di1;
  p2_total += di2;

  const [pil1, pil2] = check_pillars();
  p1_total += pil1;
  p2_total += pil2;

  const [stc1, stc2] = check_stairs_col_wise();
  p1_total += stc1;
  p2_total += stc2;

  const [str1, str2] = check_stairs_row_wise();
  p1_total += str1;
  p2_total += str2;

  const [std1, std2] = check_stairs_diagonal();
  p1_total += std1;
  p2_total += std2;

  turn += 1;

  return [p1_total, p2_total];
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

function check_diagonals() {
  let p1_found = 0;
  let p2_found = 0;
  for (let height = 0; height < current_height; height++) {
    let p1_connected = 0;
    let p2_connected = 0;
    for (let idx = 0; idx < n_pieces; idx++) {
      if (game_state[idx][idx][height] == 0) break;
      else if (game_state[idx][idx][height] == 1) p1_connected += 1;
      else p2_connected += 1;
    }
    if (p1_connected == n_pieces) {
      p1_found += 1;
      console.log("found p1 straight diagonal");
    }
    if (p2_connected == n_pieces) {
      p2_found += 1;
      console.log("found p2 straight diagonal");
    }

    p1_connected = 0;
    p2_connected = 0;
    for (let idx = 0; idx < n_pieces; idx++) {
      if (game_state[idx][n_pieces - idx - 1][height] == 0) break;
      else if (game_state[idx][n_pieces - idx - 1][height] == 1)
        p1_connected += 1;
      else p2_connected += 1;
    }
    if (p1_connected == n_pieces) {
      p1_found += 1;
      console.log("found p1 straight diagonal");
    }
    if (p2_connected == n_pieces) {
      p2_found += 1;
      console.log("found p2 straight diagonal");
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
    const piece = game_state[idx][idx][idx];
    if (piece == 0) break;
    else if (piece == 1) p1_connected += 1;
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

  p1_connected = 0;
  p2_connected = 0;

  for (let idx = 0; idx < n_pieces; idx++) {
    const piece = game_state[idx][n_pieces - 1 - idx][idx];
    if (piece == 0) break;
    else if (piece == 1) p1_connected += 1;
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

  p1_connected = 0;
  p2_connected = 0;

  for (let idx = 0; idx < n_pieces; idx++) {
    const piece = game_state[n_pieces - 1 - idx][n_pieces - 1 - idx][idx];
    if (piece == 0) break;
    else if (piece == 1) p1_connected += 1;
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

  p1_connected = 0;
  p2_connected = 0;

  for (let idx = 0; idx < n_pieces; idx++) {
    const piece = game_state[n_pieces - 1 - idx][idx][idx];
    if (piece == 0) break;
    else if (piece == 1) p1_connected += 1;
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
