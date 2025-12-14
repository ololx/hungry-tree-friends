export class WebGlMesh {
    constructor(gl, shared, _attribLocations) {
        this.gl = gl;
        const vbo = gl.createBuffer();
        if (!vbo) {
            throw new Error("Failed to create vertex buffer");
        }
        this.vbo = vbo;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, shared.vertices, gl.STATIC_DRAW);
        const floatsPerVertex = shared.stride / Float32Array.BYTES_PER_ELEMENT;
        this.vertexCount = shared.vertices.length / floatsPerVertex;
        if (shared.indices && shared.indices.length > 0) {
            const ibo = gl.createBuffer();
            if (!ibo) {
                throw new Error("Failed to create index buffer");
            }
            this.ibo = ibo;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, shared.indices, gl.STATIC_DRAW);
            this.hasIndices = true;
            this.indexCount = shared.indices.length;
        }
        else {
            this.ibo = null;
            this.hasIndices = false;
            this.indexCount = 0;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    bindAndConfigure(attribLocations, stride, attributes) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        const strideBytes = stride;
        for (const attr of attributes) {
            const loc = attribLocations[attr.semantic];
            if (loc === undefined || loc < 0)
                continue;
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, attr.size, gl.FLOAT, false, strideBytes, attr.offset);
        }
        if (this.hasIndices && this.ibo) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        }
        else {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }
    draw() {
        const gl = this.gl;
        if (this.hasIndices && this.ibo) {
            gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
        }
        else {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        }
    }
}
