export class AnimationComponent {
    constructor(animations, initial = "idle", speed = 1.0, loop = true) {
        this.frameIndex = 0;
        this.timer = 0;
        this.speed = 1.0;
        this.loop = true;
        this.playing = true;
        this.justChanged = true;
        this.animations = animations;
        this.current = initial;
        this.speed = speed;
        this.loop = loop;
    }
}
export function setAnimation(world, id, name, opts = {}) {
    var _a, _b;
    const anim = world.getComponent(id, "Animation");
    if (!anim)
        return;
    if (anim.current === name && anim.playing)
        return;
    anim.current = name;
    anim.loop = (_a = opts.loop) !== null && _a !== void 0 ? _a : true;
    anim.speed = (_b = opts.speed) !== null && _b !== void 0 ? _b : 1.0;
    anim.frameIndex = 0;
    anim.timer = 0;
    anim.playing = true;
    anim.justChanged = true;
}
export function makeFrames(xs, y, w, h, duration = 0.1) {
    return xs.map((x) => ({ x, y, w, h, duration }));
}
export function createAnimationsFromGrid(frameSize, definitions) {
    const animations = {};
    for (const [name, def] of Object.entries(definitions)) {
        animations[name] = def.frames.map(([col, row]) => ({
            x: col * frameSize.w,
            y: row * frameSize.h,
            w: frameSize.w,
            h: frameSize.h,
            duration: def.duration
        }));
    }
    return animations;
}
export function createAnimations(animationsDefinitions, spriteSheetSize, rows = 1, cols = 1) {
    const frameSize = { w: spriteSheetSize.w / cols, h: spriteSheetSize.h / rows };
    return createAnimationsFromGrid(frameSize, animationsDefinitions);
}
