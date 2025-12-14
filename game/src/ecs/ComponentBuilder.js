import {Shiit} from "../../../shiitake/target/Shiitake.js";

export const ComponentBuilders = {
    RhythmNote(cfg) {
        return cfg;
    },

    Camera(cfg) {
        const { size, scale, rotation } = cfg;
        return new Shiit.CameraComponent(size.w, size.h, scale.x, scale.y, rotation);
    },

    Transform(cfg) {
        const { position, z, rotation, scale, size } = cfg;
        return new Shiit.TransformComponent(position.x, position.y, z ?? 0, rotation ?? 0, scale.x, scale.y, size.w, size.h);
    },

    Sprite(cfg) {
        const { textureName, size, frame, pivot, materialId } = cfg;
        const sprite = new Shiit.SpriteComponent(textureName, size, frame, pivot);

        if (materialId) {
            sprite.materialId = materialId;
        }

        return sprite;
    },

    Animation(cfg) {
        const { animations, frameSize, rows, cols, defaultState } = cfg;
        return new Shiit.AnimationComponent(Shiit.createAnimations(animations, frameSize, rows, cols), defaultState);
    },

    Sound(cfg) {
        return new Shiit.SoundComponent({
            soundName: cfg.soundName,
            mode:      cfg.mode   ?? "oneShot",
            active:    cfg.active ?? false,
            volume:    cfg.volume ?? 1,
            fadeMs:    cfg.fadeMs ?? 0,
        });
    },
};
