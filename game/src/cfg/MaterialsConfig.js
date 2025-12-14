import {Shiit} from "../../../shiitake/target/Shiitake.js";

export const MaterialsCfg = {
    spriteMaterials() {
        return [
            new Shiit.SharedMaterial({
                id: "sunlight",
                shader: "sprite-unlit-textured",
                textureName: "sunlight",
                color: [1, 1, 1, 0.3],
                depthTest: false,
                depthWrite: false,
                blendMode: "additive",
            }),

            new Shiit.SharedMaterial({
                id: "progress",
                shader: "sprite-unlit-textured",
                textureName: "progress",
                color: [1, 1, 1, 0.88],
                depthTest: false,
                depthWrite: false,
                blendMode: "alpha",
            }),

            new Shiit.SharedMaterial({
                id: "bomb",
                shader: "sprite-unlit-textured",
                textureName: "note",
                color: [1, 0.5, 0.5, 0.8],
                depthTest: false,
                depthWrite: false,
                blendMode: "alpha",
            }),

            new Shiit.SharedMaterial({
                id: "shadow",
                shader: "sprite-unlit-textured",
                textureName: "shadow",
                color: [0, 0, 0, 0.5],
                depthTest: false,
                depthWrite: false,
                blendMode: "alpha",
            }),
        ];
    },
};
