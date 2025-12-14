import { AbstractSystem } from "../AbstractSystem.js";
export class AnimationSystem extends AbstractSystem {
    constructor() {
        super("AnimationSystem", 300);
    }
    update(world, tick) {
        const dt = tick.deltaTime;
        const ids = world.queryByComponentsIds("Animation", "Sprite");
        for (const id of ids) {
            const anim = world.getComponent(id, "Animation");
            const sprite = world.getComponent(id, "Sprite");
            if (!anim || !sprite || !anim.playing)
                continue;
            const clip = anim.animations[anim.current];
            if (!clip || clip.length === 0)
                continue;
            if (anim.justChanged) {
                anim.frameIndex = Math.min(anim.frameIndex, clip.length - 1);
                sprite.currentFrame = clip[anim.frameIndex];
                sprite.size.width = sprite.currentFrame.w;
                sprite.size.height = sprite.currentFrame.h;
                anim.timer = 0;
                anim.justChanged = false;
                continue;
            }
            const cur = clip[anim.frameIndex];
            const frameDuration = Math.max(1e-5, cur.duration) / Math.max(1e-5, anim.speed);
            anim.timer += dt;
            while (anim.timer >= frameDuration) {
                anim.timer -= frameDuration;
                anim.frameIndex++;
                if (anim.frameIndex >= clip.length) {
                    if (anim.loop)
                        anim.frameIndex = 0;
                    else {
                        anim.frameIndex = clip.length - 1;
                        anim.playing = false;
                    }
                }
                const next = clip[anim.frameIndex];
                sprite.currentFrame = next;
                sprite.size.width = next.w;
                sprite.size.height = next.h;
            }
        }
    }
}
