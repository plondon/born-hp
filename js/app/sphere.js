var camera;
var scene;
var renderer;
var controls;
var objects = [];
var targets = { sphere: [] }

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 10000);

  camera.position.z = 1;

  scene = new THREE.Scene();

  for ( var i = 0; i < 100; i++ ) {

    var element = document.createElement('div');
    element.className = 'element';
    element.style.backgroundColor = 'black';

    var object = new THREE.CSS3DObject(element);
    object.position.x = Math.random() * 4000 - 1000;
    object.position.y = Math.random() * 4000 - 1000;
    object.position.z = Math.random() * 4000 - 1000;
    scene.add(object);

    objects.push(object);

  }

  var vector = new THREE.Vector3();

  for ( var i = 0, l = objects.length; i < l; i++ ) {

    var phi = Math.acos( -1 + (2*i) / l );
    var theta = Math.sqrt( l * Math.PI ) * phi;

    var object = new THREE.Object3D();

    object.position.x = 400 * Math.cos( theta ) * Math.sin(phi);
    object.position.y = 400 * Math.sin( theta ) * Math.sin(phi);
    object.position.z = 400 * Math.cos( phi );

    vector.copy( object.position ).multiplyScalar(2);

    object.lookAt(vector);

    targets.sphere.push(object);

  }

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.style.position = 'absolute';
  document.getElementById( 'container' ).appendChild( renderer.domElement );

  //

  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.noZoom = false;
  controls.addEventListener( 'change', render );

  camera.position.z = 2000;
  transform( targets.sphere, 2000 );

  window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration ) {

  TWEEN.removeAll();

  for ( var i = 0; i < objects.length; i ++ ) {

    var object = objects[ i ];
    var target = targets[ i ];

    new TWEEN.Tween( object.position )
      .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

    new TWEEN.Tween( object.rotation )
      .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

  }

  new TWEEN.Tween( this )
    .to( {}, duration * 2 )
    .onUpdate( render )
    .start();

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

function animate() {

  requestAnimationFrame( animate );

  TWEEN.update();

  controls.update();

  console.log(camera.position.z)

}

function render() {

  renderer.render( scene, camera );

}
