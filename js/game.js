import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function initGame() {
  const canvas = document.getElementById("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  //camera and orbit controls
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 5, 10);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 12;
  controls.maxDistance = 20;
  controls.target.set(0, 0, 0);

  //lighting
  const ambient_light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient_light);
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(3, 4, 5);
  scene.add(light);
  const piece_size = 1;
  const padding_size = 1;
  const n_pieces = 4;

  function find_origin(piece_size, padding_size, n_pieces) {
    const total_width =
      (piece_size + padding_size) * (n_pieces - 1) + piece_size;
    const half_width = total_width / 2;
    return new THREE.Vector3(
      -half_width + piece_size / 2,
      0,
      -half_width + piece_size / 2,
    );
  }

  const pieces_origin = find_origin(piece_size, padding_size, n_pieces);
  const piece_geometry = new THREE.SphereGeometry(piece_size / 2, 16, 8);
  const piece_material_1 = new THREE.MeshStandardMaterial({
    color: THREE.Color.NAMES.greenyellow,
  });
  const piece_material_2 = new THREE.MeshStandardMaterial({
    color: THREE.Color.NAMES.blueviolet,
  });

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
  const rod_height = piece_size * n_pieces + padding_size / 2;
  const rod_geometry = new THREE.CapsuleGeometry(0.1, rod_height);
  const rod_material = new THREE.MeshStandardMaterial();
  for (let row = 0; row < n_pieces; row++) {
    for (let col = 0; col < n_pieces; col++) {
      const rod = new THREE.Mesh(rod_geometry, rod_material);
      const x = pieces_origin.x + col * (piece_size + padding_size);
      const z = pieces_origin.z + row * (piece_size + padding_size);
      rod.position.set(x, rod_height / 2 - padding_size, z);
      scene.add(rod);
    }
  }

  const board_geometry = new THREE.BoxGeometry(
    (piece_size + padding_size) * n_pieces + piece_size,
    piece_size / 2,
    (piece_size + padding_size) * n_pieces + piece_size,
  );

  const board_material = new THREE.MeshStandardMaterial({
    color: THREE.Color.NAMES.darkgrey,
  });
  const board = new THREE.Mesh(board_geometry, board_material);
  scene.add(board);
  board.position.set(0, (-3 * piece_size) / 4, 0);

  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update orbit controls
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
