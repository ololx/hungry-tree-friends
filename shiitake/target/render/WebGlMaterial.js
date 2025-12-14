export class WebGlMaterial {
    constructor(gl, shared, vs, fs) {
        this.gl = gl;
        const program = this.createProgram(vs, fs);
        if (!program)
            throw new Error("Failed to create WebGL program for material " + shared.id);
        this.program = program;
        this.depthTest = shared.depthTest;
        this.depthWrite = shared.depthWrite;
        this.blendMode = shared.blendMode;
        this.color = shared.color;
        this.uModelLoc = gl.getUniformLocation(program, "u_model");
        this.uViewLoc = gl.getUniformLocation(program, "u_view");
        this.uProjLoc = gl.getUniformLocation(program, "u_projection");
        this.uFrameLoc = gl.getUniformLocation(program, "u_frame");
        this.uColorLoc = gl.getUniformLocation(program, "u_color");
    }
    applyGlobalState() {
        const gl = this.gl;
        if (this.depthTest)
            gl.enable(gl.DEPTH_TEST);
        else
            gl.disable(gl.DEPTH_TEST);
        gl.depthMask(this.depthWrite);
        switch (this.blendMode) {
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
    use() {
        this.gl.useProgram(this.program);
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
    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader)
            return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader compile error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
}
