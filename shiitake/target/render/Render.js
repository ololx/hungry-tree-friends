import { SharedMesh } from "./SharedMesh.js";
import { WebGlMesh } from "./WebGlMesh.js";
import { WebGlMaterial } from "./WebGlMaterial.js";
export class Render {
    constructor(gl) {
        this.sharedMeshes = new Map();
        this.webglMeshes = new Map();
        this.sharedMaterials = new Map();
        this.webglMaterials = new Map();
        this.attribLocations = {
            position: () => this.aPositionLoc,
            uv: () => this.aCoordLoc,
        };
        this.program = null;
        this.positionBuffer = null;
        this.texCoordBuffer = null;
        this.uFrameLoc = null;
        this.uModelLoc = null;
        this.uViewLoc = null;
        this.uProjLoc = null;
        this.aPositionLoc = -1;
        this.aCoordLoc = -1;
        this.currentModel = null;
        this.currentView = null;
        this.currentProjection = null;
        this.vsSource = null;
        this.fsSource = null;
        if (!gl) {
            throw new Error("Render requires a WebGLRenderingContext.");
        }
        this.gl = gl;
        this.registerSharedMesh(SharedMesh.makeQuad("quad"));
    }
    registerSharedMesh(mesh) {
        this.sharedMeshes.set(mesh.id, mesh);
    }
    registerSharedMaterial(material) {
        this.sharedMaterials.set(material.id, material);
    }
    getOrCreateWebGlMesh(id) {
        const shared = this.sharedMeshes.get(id);
        if (!shared)
            return undefined;
        let native = this.webglMeshes.get(id);
        if (native)
            return native;
        const locs = {
            position: this.aPositionLoc,
            uv: this.aCoordLoc,
        };
        native = new WebGlMesh(this.gl, shared, locs);
        this.webglMeshes.set(id, native);
        return native;
    }
    getOrCreateWebGlMaterial(id, vs, fs) {
        const shared = this.sharedMaterials.get(id);
        if (!shared)
            return undefined;
        let native = this.webglMaterials.get(id);
        if (native)
            return native;
        native = new WebGlMaterial(this.gl, shared, vs, fs);
        this.webglMaterials.set(id, native);
        return native;
    }
    initWebGL(vertexShaderSource, fragmentShaderSource) {
        this.vsSource = vertexShaderSource;
        this.fsSource = fragmentShaderSource;
        const gl = this.gl;
        this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
        if (!this.program) {
            throw new Error("Failed to create WebGL program");
        }
        gl.useProgram(this.program);
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0, 0, 1,
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            1, 0, 0, 1,
            1, 1, 0, 1
        ]), gl.STATIC_DRAW);
        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1,
        ]), gl.STATIC_DRAW);
        this.aPositionLoc = gl.getAttribLocation(this.program, "a_position");
        this.aCoordLoc = gl.getAttribLocation(this.program, "a_coord");
        this.uFrameLoc = gl.getUniformLocation(this.program, "u_frame");
        this.uModelLoc = gl.getUniformLocation(this.program, "u_model");
        this.uViewLoc = gl.getUniformLocation(this.program, "u_view");
        this.uProjLoc = gl.getUniformLocation(this.program, "u_projection");
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 1);
    }
    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    setMatrices(model, view, projection) {
        this.currentModel = model;
        this.currentView = view;
        this.currentProjection = projection;
        if (!this.program) {
            return;
        }
        this.gl.useProgram(this.program);
        if (this.uModelLoc) {
            this.gl.uniformMatrix4fv(this.uModelLoc, false, model);
        }
        if (this.uViewLoc) {
            this.gl.uniformMatrix4fv(this.uViewLoc, false, view);
        }
        if (this.uProjLoc) {
            this.gl.uniformMatrix4fv(this.uProjLoc, false, projection);
        }
    }
    drawMesh(meshId, materialId, texture, frame, props, model, view, projection) {
        var _a, _b, _c, _d;
        if (!this.vsSource || !this.fsSource) {
            console.warn("Render not initialized with shaders");
            return;
        }
        const mesh = this.getOrCreateWebGlMesh(meshId);
        const mat = this.getOrCreateWebGlMaterial(materialId, this.vsSource, this.fsSource);
        if (!mesh || !mat)
            return;
        const gl = this.gl;
        mat.applyGlobalState();
        mat.use();
        if (mat.uModelLoc)
            gl.uniformMatrix4fv(mat.uModelLoc, false, model);
        if (mat.uViewLoc)
            gl.uniformMatrix4fv(mat.uViewLoc, false, view);
        if (mat.uProjLoc)
            gl.uniformMatrix4fv(mat.uProjLoc, false, projection);
        if (mat.uFrameLoc) {
            const tx = frame.x / props.w;
            const ty = frame.y / props.h;
            const tw = frame.w / props.w;
            const th = frame.h / props.h;
            gl.uniform4fv(mat.uFrameLoc, new Float32Array([tx, ty, tw, th]));
        }
        if (mat.uColorLoc) {
            gl.uniform4fv(mat.uColorLoc, new Float32Array(mat.color));
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const uTexLoc = gl.getUniformLocation(mat.program, "u_texture");
        if (uTexLoc)
            gl.uniform1i(uTexLoc, 0);
        const attrs = (_b = (_a = this.sharedMeshes.get(meshId)) === null || _a === void 0 ? void 0 : _a.attributes) !== null && _b !== void 0 ? _b : [
            { semantic: 'position', size: 4, offset: 0 },
            { semantic: 'uv', size: 2, offset: 4 * Float32Array.BYTES_PER_ELEMENT },
        ];
        mesh.bindAndConfigure({ position: this.aPositionLoc, uv: this.aCoordLoc }, (_d = (_c = this.sharedMeshes.get(meshId)) === null || _c === void 0 ? void 0 : _c.stride) !== null && _d !== void 0 ? _d : 6 * Float32Array.BYTES_PER_ELEMENT, attrs);
        mesh.draw();
    }
    applySharedMaterial(mat) {
        const gl = this.gl;
        if (mat.depthTest)
            gl.enable(gl.DEPTH_TEST);
        else
            gl.disable(gl.DEPTH_TEST);
        gl.depthMask(mat.depthWrite);
        switch (mat.blendMode) {
            case 'alpha':
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                break;
            case 'additive':
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                break;
            default:
                gl.disable(gl.BLEND);
                break;
        }
    }
    drawSpriteWithMaterial(material, texture, frame, props) {
        this.registerSharedMaterial(material);
        if (!this.sharedMeshes.has("quad")) {
            this.registerSharedMesh(SharedMesh.makeRhombus("quad"));
        }
        if (!this.currentModel || !this.currentView || !this.currentProjection) {
            console.warn("Render.drawSpriteWithMaterial: matrices are not set. Call setMatrices() before drawing.");
            return;
        }
        this.drawMesh("quad", material.id, texture, frame, props, this.currentModel, this.currentView, this.currentProjection);
    }
    setFrame(frame, properties) {
        if (!this.program || !this.uFrameLoc) {
            return;
        }
        const textureFrame = {
            tx: frame.x / properties.w,
            ty: frame.y / properties.h,
            tw: frame.w / properties.w,
            th: frame.h / properties.h,
        };
        this.gl.useProgram(this.program);
        this.gl.uniform4fv(this.uFrameLoc, new Float32Array([textureFrame.tx, textureFrame.ty, textureFrame.tw, textureFrame.th]));
    }
    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader)
            return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    createProgram(vsSource, fsSource) {
        const gl = this.gl;
        const vs = this.createShader(gl.VERTEX_SHADER, vsSource.source);
        const fs = this.createShader(gl.FRAGMENT_SHADER, fsSource.source);
        if (!vs || !fs)
            return null;
        const program = gl.createProgram();
        if (!program)
            return null;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
}
