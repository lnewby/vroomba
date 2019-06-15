export function groundPlane() {
    const el = document.createElement('a-plane');
    el.setAttribute('static-body', {});
    el.setAttribute('width', 30);
    el.setAttribute('height', 30);
    el.setAttribute('color', '#7BC8A4');
    el.object3D.position.set(0, 0, 0);
    el.object3D.rotation.x = THREE.Math.degToRad(-90);
    return el;
}

export function sky() {
    const el = document.createElement('a-sky');
    el.setAttribute('color', '#ECECEC');
    return el;
}