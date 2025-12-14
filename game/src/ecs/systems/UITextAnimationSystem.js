import {Shiit} from "../../../../shiitake/target/Shiitake.js";

export class UITextAnimationSystem extends Shiit.AbstractSystem {
    constructor(world, animatedEntities) {
        super("UITextAnimationSystem", 800);
        this.world = world;
        this.animatedEntities = animatedEntities;
    }

    update(world, tick) {
        const dt = tick.deltaTime || 0;

        for (const e of this.animatedEntities) {
            const anim = world.getComponent(e, "UITextAnimation");
            const tr = world.getComponent(e, "Transform");
            const text = world.getComponent(e, "UIText");

            if (!anim || !tr || !text) {
              continue;
            }

            if (!anim.active) {
              continue;
            }

            anim.timer += dt;
            const t = Math.min(anim.timer / anim.duration, 1);

            switch (anim.type) {
                case "comboPopup": {
                    const amp = 0.4;
                    const s = 1 + Math.sin(t * Math.PI) * amp;
                    tr.scale.x = s;
                    tr.scale.y = s;

                    let alpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
                    text.alpha = Math.max(0, Math.min(1, alpha));
                    break;
                }
                default:
                    break;
            }

            if (t >= 1) {
                anim.active = false;
                if (anim.autoHide) {
                    text.alpha = 0;
                }

                tr.scale.x = tr.scale.y = 1;
            }
        }
    }
}
