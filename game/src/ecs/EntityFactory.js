import {CameraCfg} from "../cfg/CameraConfig.js";
import {EntitiesCfg} from "../cfg/EntitiesConfig.js";
import {ComponentBuilders} from "./ComponentBuilder.js";

export function createSceneEntityFromConfig(world, resources, cfg, overrides = {}) {
    const entity = world.createEntity(cfg.name);
    const tex = cfg.textureName ? resources.getTexture(cfg.textureName) : null;
    const context = {world, resources, cfg, tex, CameraCfg, EntitiesCfg, overrides,};

    const components = cfg.components ?? [];
    for (const compCfg of components) {
        const builder = ComponentBuilders[compCfg.type];
        if (!builder) {
            continue;
        }

        if (compCfg.needsTexture && !tex) {
            continue;
        }

        const rawConfig = typeof compCfg.config === "function" ? compCfg.config(context) : (compCfg.config || {});
        const instance = builder(rawConfig);
        world.addComponent(entity, compCfg.type, instance);
    }

    return entity;
}

