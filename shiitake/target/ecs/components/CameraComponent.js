export class CameraComponent {
    constructor(width = 512, height = 512, scaleX = 1, scaleY = 1, rotation = 0) {
        this.size = { width, height };
        this.scale = { x: scaleX, y: scaleY };
        this.rotation = rotation;
    }
}
