import * as THREE from "three";
import { piece_size, padding_size, pieces_origin } from "./game";

function create_piece_mesh(player) {
  const piece_geometry = new THREE.SphereGeometry(piece_size / 2, 16, 8);
  const piece_material_1 = new THREE.MeshStandardMaterial({
    color: THREE.Color.NAMES.greenyellow,
  });
  const piece_material_2 = new THREE.MeshStandardMaterial({
    color: THREE.Color.NAMES.blueviolet,
  });
  let material;
  if (player == 1) material = piece_material_1;
  else material = piece_material_2;

  const piece = new THREE.Mesh(piece_geometry, material);
  return piece;
}

export function place_piece_mesh(row, col, height, player) {
  const piece = create_piece_mesh(player);
  const x = pieces_origin.x + col * (piece_size + padding_size);
  const y = height * piece_size;
  const z = pieces_origin.z + row * (piece_size + padding_size);
  piece.position.set(x, y, z);
  piece.name = "(" + row + "," + col + "," + height + ")";
  return piece;
}
