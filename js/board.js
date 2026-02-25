import * as THREE from "three";
import { piece_size, padding_size, n_pieces } from "./game";


export function find_origin(piece_size, padding_size, n_pieces) {
    const total_width = (piece_size + padding_size) * (n_pieces - 1) + piece_size;
    const half_width = total_width / 2;
    return new THREE.Vector3(
        -half_width + piece_size / 2,
        0,
        -half_width + piece_size / 2,
    );
}


const pieces_origin = find_origin(piece_size, padding_size, n_pieces);


const rod_height = piece_size * n_pieces + padding_size / 2;
const rod_geometry = new THREE.CapsuleGeometry(0.1, rod_height);
const rod_material = new THREE.MeshStandardMaterial();
export const rods = new Array(n_pieces * n_pieces);


export function create_rods()
{
    for (let row = 0; row < n_pieces; row++) {
        for (let col = 0; col < n_pieces; col++) {
            const rod = new THREE.Mesh(rod_geometry, rod_material);
            const x = pieces_origin.x + col * (piece_size + padding_size);
            const z = pieces_origin.z + row * (piece_size + padding_size);
            rod.position.set(x, rod_height / 2 - padding_size, z);
            rods.add(rod);
        }
    }
}
create_rods();


const board_geometry = new THREE.BoxGeometry(
(piece_size + padding_size) * n_pieces + piece_size,
piece_size / 2,
(piece_size + padding_size) * n_pieces + piece_size,
);

const board_material = new THREE.MeshStandardMaterial({
color: THREE.Color.NAMES.darkgrey,
});
export const board = new THREE.Mesh(board_geometry, board_material);
board.position.set(0, (-3 * piece_size) / 4, 0);
