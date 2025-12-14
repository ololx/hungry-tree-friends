import {Shiit} from "../../../../shiitake/target/Shiitake.js";
import {UIConstants} from "../../cfg/UIConfig.js";

export class UIRenderSystem extends Shiit.AbstractSystem {
    constructor(uiDisplay, world, uiEntities, gameStateEntityId) {
        super("UIRenderSystem", 9999);
        this.display = uiDisplay;
        this.renderer = new Shiit.Canvas2DRender(uiDisplay);
        this.world = world;
        this.uiEntities = uiEntities
            .map((e) => {
                const ui = world.getComponent(e, "UI");
                return {id: e, layer: ui?.layer ?? 0};
            })
            .sort((a, b) => a.layer - b.layer);
        this.gameStateEntityId = gameStateEntityId;
    }

    update(world, _tick) {
        const gs = world.getComponent(this.gameStateEntityId, "GameState");
        const overlayAlpha = gs ? (gs.overlayAlpha ?? 0) : 0;
        this.renderer.clear();

        for (const {id} of this.uiEntities) {
            const visibility = world.getComponent(id, "Visibility");
            if (!visibility || !visibility.visible) continue;

            const rect = world.getComponent(id, "UIRect");
            if (rect) {
                this._drawUIRectEntity(world, id, rect, overlayAlpha);
            }

            const text = world.getComponent(id, "UIText");
            if (text) {
                this._drawUITextEntity(world, id, text);
            }
        }
    }

    _drawUIRectEntity(world, e, rect, overlayAlpha) {
        const tr = world.getComponent(e, "Transform");
        if (!tr) return;

        let alpha = rect.alpha ?? 1.0;

        if (rect.useOverlayAlpha) {
            alpha *= overlayAlpha * UIConstants.OVERLAY_DARKEN_FACTOR;
        }

        if (alpha <= UIConstants.OVERLAY_EPSILON) return;

        this.renderer.resetTransform();
        this.renderer.setTransform({
            x: tr.position.x,
            y: tr.position.y,
            scaleX: tr.scale.x,
            scaleY: tr.scale.y,
            rotation: tr.rotation,
        });

        this.renderer.drawPrimitive({
            x: 0,
            y: 0,
            w: rect.w ?? this.display.designWidth,
            h: rect.h ?? this.display.designHeight,
            fillStyle: rect.fillStyle,
            alpha,
        });

        this.renderer.resetTransform();
    }

    _drawUITextEntity(world, e, text) {
        const tr = world.getComponent(e, "Transform");
        if (!tr || !text) return;

        const alpha = text.alpha ?? 1.0;
        if (alpha <= 0) return;

        this.renderer.setTransform({
            x: tr.position.x,
            y: tr.position.y,
            scaleX: tr.scale.x,
            scaleY: tr.scale.y,
            rotation: tr.rotation,
        });

        this.renderer.drawText({
            text: text.text,
            x: 0,
            y: 0,
            font: text.font,
            fillStyle: this._applyAlphaToColor(text.fillStyle, alpha),
            textAlign: text.textAlign,
            textBaseline: text.textBaseline,
            shadowColor: this._applyAlphaToColor(text.shadowColor, alpha),
            shadowBlur: text.shadowBlur,
            shadowOffsetX: text.shadowOffsetX,
            shadowOffsetY: text.shadowOffsetY,
        });

        this.renderer.resetTransform();
    }

    _applyAlphaToColor(color, alpha) {
        if (!color || alpha >= 0.999) return color;
        if (color.startsWith("rgba")) {
            const parts = color.slice(5, -1).split(",");
            if (parts.length === 4) {
                parts[3] = String(parseFloat(parts[3]) * alpha);
                return `rgba(${parts.join(",")})`;
            }
        }
        if (color.startsWith("rgb")) {
            const parts = color.slice(4, -1).split(",");
            if (parts.length === 3) {
                return `rgba(${parts.join(",")},${alpha})`;
            }
        }
        return color;
    }
}
