var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SharedMaterial } from "../render/SharedMaterial.js";
export class ResourceManager {
    constructor(gl) {
        this.gl = gl;
        this.textures = new Map();
        this.shaders = new Map();
        this.materials = new Map();
    }
    loadTexture(name, src) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.textures.has(name)) {
                return name;
            }
            const glTexture = this.gl.createTexture();
            if (!glTexture) {
                throw new Error("Не удалось создать WebGLTexture");
            }
            const image = yield this.loadImage(src);
            const size = { w: image.width, h: image.height };
            this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
            const textureObject = {
                source: src,
                glTexture: glTexture,
                size: size
            };
            this.textures.set(name, textureObject);
            return name;
        });
    }
    loadShader(name, src) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.shaders.has(name)) {
                return name;
            }
            const response = yield fetch(src);
            const shaderSource = yield response.text();
            this.shaders.set(name, shaderSource);
            return name;
        });
    }
    loadImage(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Не удалось загрузить изображение: ${url}`));
            image.src = url;
        });
    }
    getTexture(name) {
        return this.textures.get(name);
    }
    getShader(name) {
        return this.shaders.get(name);
    }
    getOrCreateSpriteMaterial(textureName) {
        const id = `sprite:${textureName}`;
        let mat = this.materials.get(id);
        if (mat)
            return mat;
        mat = new SharedMaterial({
            id,
            shader: 'sprite-unlit-textured',
            textureName,
            depthTest: false,
            depthWrite: false,
            blendMode: 'alpha',
        });
        this.loadSpriteMaterial(mat);
        return mat;
    }
    loadSpriteMaterial(material) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = `sprite:${material.id}`;
            this.materials.set(id, material);
            return id;
        });
    }
    getMaterial(id) {
        return this.materials.get(id);
    }
}
