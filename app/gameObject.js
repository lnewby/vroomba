export function sphere() {
    const el = document.createElement('a-sphere');
    el.setAttribute('dynamic-body', {
        shape: 'sphere',
        mass: 1.5,
        linearDamping: 0.005
    });
    el.setAttribute('color', '#00FF00');
    el.setAttribute('radius', 0.5);
    el.object3D.position.set(-1, 6, -3);
    return el;
}

export function box() {
    const el = document.createElement('a-box');
    el.setAttribute('dynamic-body', {
        shape: 'box',
        width: 0.2,
        height: 0.2,
        depth: 0.2,
        mass: 1.5,
        linearDamping: 0.005
    });
    el.setAttribute('color', '#4CC3D9');
    el.object3D.position.set(-1, 4,-3);
    el.object3D.rotation.y = THREE.Math.degToRad(45);
    return el;
}

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