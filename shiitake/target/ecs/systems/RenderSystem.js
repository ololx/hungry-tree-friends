import { Matrices } from "../../math/matrix/Matrices.js";
import { AbstractSystem } from "../AbstractSystem.js";
import { TextureRenderFrame } from "../../render/TextureRenderFrame.js";
import { TextureRenderProperties } from "../../render/TextureRenderProperties.js";
export class RenderSystem extends AbstractSystem {
    constructor(resourceManager, renderEngine) {
        super("RenderSystem", 1000);
        this.renderEngine = renderEngine;
        this.resourceManager = resourceManager;
    }
    update(world, _tick) {
        this.renderEngine.clear();
        const camId = world.firstByComponentsId("Camera", "Transform");
        if (camId === undefined)
            return;
        const camTr = world.getComponent(camId, "Transform");
        const cam = world.getComponent(camId, "Camera");
        if (!camTr || !cam)
            return;
        const ids = world.queryByComponentsIds("Sprite", "Transform");
        ids.sort((idA, idB) => {
            const trA = world.getComponent(idA, "Transform");
            const trB = world.getComponent(idB, "Transform");
            if (!trA)
                return 1;
            if (!trB)
                return -1;
            return trA.position.z - trB.position.z;
        });
        for (const id of ids) {
            const sprite = world.getComponent(id, "Sprite");
            const tr = world.getComponent(id, "Transform");
            if (!sprite || !tr)
                continue;
            const frameW = sprite.currentFrame.w;
            const frameH = sprite.currentFrame.h;
            const worldW = tr.size.w > 0 ? tr.size.w : frameW;
            const worldH = tr.size.h > 0 ? tr.size.h : frameH;
            const pivotX = sprite.pivot.x;
            const pivotY = sprite.pivot.y;
            const scaleX = (sprite.flipX ? -1 : 1) * tr.scale.x;
            const scaleY = (sprite.flipY ? -1 : 1) * tr.scale.y;
            const texture = this.resourceManager.getTexture(sprite.texture);
            if (!texture) {
                console.warn(`Texture not found for entity ${id}: ${sprite.texture}`);
                continue;
            }
            const material = this.resourceManager.getOrCreateSpriteMaterial(sprite.texture);
            this.renderEngine.registerSharedMaterial(material);
            const frame = new TextureRenderFrame(sprite.currentFrame.x, sprite.currentFrame.y, sprite.currentFrame.w, sprite.currentFrame.h);
            const size = new TextureRenderProperties(texture.size.w, texture.size.h);
            this.renderEngine.drawMesh("quad", material.id, texture.glTexture, frame, size, Matrices.matrix4x4.model2D(tr.position.x, tr.position.y, tr.position.z, tr.rotation, worldW, worldH, scaleX, scaleY, pivotX, pivotY).toArray(), Matrices.matrix4x4.view2D(camTr.position.x, camTr.position.y, camTr.position.z, camTr.rotation, camTr.scale.x, camTr.scale.y).toArray(), Matrices.matrix4x4.orthoBySize(cam.size.width, cam.size.height).toArray());
        }
    }
}
