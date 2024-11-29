import * as THREE from 'three';

class Avatar {
    constructor(scene, camera, speed = 0.5) {
        this.scene = scene;
        this.camera = camera;
        this.speed = speed;

        this.geometry = new THREE.SphereGeometry(1, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000});
        this.avatar = new THREE.Mesh(this.geometry, this.material);
        this.avatar.position.set(0, 2, 0);

        this.scene.add(this.avatar);

        this.keys = {};
        this.moveDirection = new THREE.Vector3(0, 0, 0);

        window.addEventListener('keydown', (event) => {
            this.keys[event.key.toLowerCase()] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key.toLowerCase()] = false;
        });
    }

    update() {
        const direction = this.moveDirection;
        direction.set(0, 0, 0);

        if (this.keys['w']) direction.z -= this.speed;
        if (this.keys['s']) direction.z += this.speed;
        if (this.keys['a']) direction.x -= this.speed;
        if (this.keys['d']) direction.x += this.speed;
        if (this.keys['q']) direction.y -= this.speed;
        if (this.keys['e']) direction.y += this.speed;

        this.avatar.position.add(direction);
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    resetPosition(x = 0, y = 2, z = 0) {
        this.avatar.position.set(x, y, z);
    }
}

export { Avatar };