export class SpriteComponent {
    constructor(texture, textureSize, frame, pivot = { x: 0.5, y: 0.5 }) {
        this.flipX = false;
        this.flipY = false;
        this.texture = texture;
        this.textureSize = textureSize;
        this.currentFrame = Object.assign({}, frame);
        this.pivot = Object.assign({}, pivot);
        this.size = { width: frame.w, height: frame.h };
    }
}
