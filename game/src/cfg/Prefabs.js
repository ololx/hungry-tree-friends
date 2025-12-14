import { EntitiesCfg } from "./EntitiesConfig.js";

export const Prefabs = {
    Note: {
        name: "Note",
        textureName: "note",

        components: [
            {
                type: "Transform",
                config: ({ overrides }) => ({
                    position: overrides.position,
                    z: overrides.z ?? 0.5,
                    rotation: 0,
                    scale: overrides.scale ?? { x: 1, y: 1 },
                    size: EntitiesCfg.note.size,
                }),
            },
            {
                type: "Sprite",
                needsTexture: true,
                config: ({ tex, overrides }) => ({
                    textureName: overrides.textureName ?? "note",
                    size: tex.size,
                    frame: { x: 0, y: 0, w: tex.size.w, h: tex.size.h },
                    pivot: { x: 0.5, y: 0.5 },
                    materialId: overrides.materialId,
                }),
            },
            {
                type: "RhythmNote",
                config: ({ overrides }) => overrides.noteComponent,
            },
        ],
    },

    NoteShadow: {
        name: "NoteShadow",
        textureName: "shadow",

        components: [
            {
                type: "Transform",
                config: ({ overrides }) => ({
                    position: overrides.position,
                    z: overrides.z ?? 0.49,
                    rotation: 0,
                    scale: overrides.scale ?? { x: 1.5, y: 1.5 },
                    size: EntitiesCfg.note.size,
                }),
            },
            {
                type: "Sprite",
                needsTexture: true,
                config: ({ tex }) => ({
                    textureName: "shadow",
                    size: tex.size,
                    frame: { x: 0, y: 0, w: tex.size.w, h: tex.size.h },
                    pivot: { x: 0.5, y: 0.5 },
                    materialId: "shadow",
                }),
            },
        ],
    },
};
