import * as THREE from "three";

export function create_rods(piece_size, padding_size, n_pieces, pieces_origin) {
  const rod_height = piece_size * n_pieces + padding_size / 2;
  const rod_geometry = new THREE.CapsuleGeometry(0.1, rod_height);
  const rod_material = new THREE.MeshStandardMaterial();

  let rods = [];
  for (let row = 0; row < n_pieces; row++) {
    for (let col = 0; col < n_pieces; col++) {
      const rod = new THREE.Mesh(rod_geometry, rod_material);
      const x = pieces_origin.x + col * (piece_size + padding_size);
      const z = pieces_origin.z + row * (piece_size + padding_size);
      rod.position.set(x, rod_height / 2 - padding_size, z);
      rods.push(rod);
    }
  }
  return rods;
}

export function create_board(piece_size, padding_size, n_pieces) {
  const board_geometry = new THREE.BoxGeometry(
    (piece_size + padding_size) * n_pieces + piece_size,
    piece_size / 2,
    (piece_size + padding_size) * n_pieces + piece_size,
  );

  const board_material = new THREE.MeshStandardMaterial({
    color: THREE.Color.NAMES.darkgrey,
  });
  const board = new THREE.Mesh(board_geometry, board_material);
  board.position.set(0, (-3 * piece_size) / 4, 0);
  return board;
}
