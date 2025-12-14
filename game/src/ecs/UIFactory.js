import {UIPrefabs} from "../cfg/UIPrefabs.js";
import {Shiit} from "../../../shiitake/target/Shiitake.js";
import {UIComponent, UIRectComponent, UITextAnimationComponent, UITextComponent} from "./components/UIComponent.js";
import {VisibilityComponent} from "./components/VidsibilityComponent.js";

const UI_COMPONENT_FACTORIES = {
    UI: (cfg) => new UIComponent(cfg.layer ?? 0),
    Visibility: (cfg) => new VisibilityComponent(cfg.visible !== false),
    Transform: (cfg) => new Shiit.TransformComponent(
        cfg.position?.x ?? 0,
        cfg.position?.y ?? 0,
        cfg.z ?? 0,
        0,
        cfg.scale?.x ?? 1,
        cfg.scale?.y ?? 1,
        cfg.rotation ?? 0,
        0
    ),
    UIText: (cfg) => new UITextComponent(cfg.text ?? "", cfg),
    UIRect: (cfg) => new UIRectComponent(cfg),
    UITextAnimation: (cfg) => new UITextAnimationComponent(cfg),
};

export function createUIEntityFromConfig(world, uiCfg) {
    const prefab = UIPrefabs[uiCfg.prefab];
    if (!prefab) {
        throw new Error(`Unknown UI prefab: ${uiCfg.prefab}`);
    }

    const entity = world.createEntity(uiCfg.name ?? prefab.name);

    for (const c of prefab.components) {
        const value = c.config({overrides: uiCfg});
        if (c.optional && (value == null || value === false)) {
            continue;
        }

        const factory = UI_COMPONENT_FACTORIES[c.type];
        if (factory) {
            world.addComponent(entity, c.type, factory(value));
        } else {
            throw new Error(`No UI component factory for: ${c.type}`);
        }
    }

    return entity;
}
