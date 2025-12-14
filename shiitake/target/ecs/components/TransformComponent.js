export class TransformComponent {
    constructor(x = 0, y = 0, z = 0, rotation = 0, scaleX = 1, scaleY = 1, width = 0, height = 0) {
        this.position = { x, y, z };
        this.rotation = rotation;
        this.scale = { x: scaleX, y: scaleY };
        this.size = { w: width, h: height };
    }
}
