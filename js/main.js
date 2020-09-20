import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js';

(async () => {

  let width = window.innerWidth;
  let height = window.innerHeight;

  let renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);

  let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const vertices = new THREE.BufferAttribute(
    new Float32Array([
      -1.0, -1.0,
      -1.0, 1.0,
      1.0, 1.0,
      1.0, -1.0
    ]), 2
  );

  const indices = new THREE.BufferAttribute(
    new Uint16Array([
      2,1,0,
      3,2,0
    ]), 1
  );

  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute('pos', vertices);
  geometry.setIndex(indices);

  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let shaderName = urlParams.get('shader');
  let shader = shaderName ? Shaders[shaderName] : Shaders['fractal1'];

  let vertInc = await (await fetch('glsl/include/vert.glsl')).text();
  let fragInc = await (await fetch('glsl/include/frag.glsl')).text();
  let vert = await (await fetch(`glsl/${shader.vert}.vert`)).text();
  let frag = await (await fetch(`glsl/${shader.frag}.frag`)).text();

  let material = new THREE.RawShaderMaterial({
    uniforms: {
      resolution: { type: 'vec2' },
      time: {value: 0},
    },
    vertexShader: `${vertInc}\n${vert}`,
    fragmentShader: `${fragInc}\n${frag}`
  });

  let mesh = new THREE.Mesh(geometry, material);

  let scene = new THREE.Scene();
  scene.add(mesh);

  window.onresize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    material.uniforms.resolution.value = new THREE.Vector2(width, height);
  };

  window.onresize();

  let clock = new THREE.Clock();

  const render = async () => {
    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    let _shaderName = urlParams.get('shader');

    if(_shaderName !== shaderName) {
      shaderName = _shaderName;

      shader = Shaders[shaderName];
      vert = await (await fetch(`glsl/${shader.vert}.vert`)).text();
      frag = await (await fetch(`glsl/${shader.frag}.frag`)).text();

      material.vertexShader = `${vertInc}\n${vert}`;
      material.fragmentShader = `${fragInc}\n${frag}`;

    }

    material.uniforms.time.value = clock.getElapsedTime();
    // material.uniforms.time.value = 0;

    material.needsUpdate = true;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  render();

})();
