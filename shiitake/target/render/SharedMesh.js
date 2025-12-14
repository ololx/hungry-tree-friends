export class SharedMesh {
    constructor(props) {
        this.id = props.id;
        this.vertices = props.vertices;
        this.indices = props.indices;
        this.stride = props.stride;
        this.attributes = props.attributes;
    }
    static makeQuad(id = 'quad') {
        const vertices = new Float32Array([
            0, 0, 0, 1, 0, 0,
            1, 0, 0, 1, 1, 0,
            0, 1, 0, 1, 0, 1,
            1, 1, 0, 1, 1, 1,
        ]);
        const indices = new Uint16Array([
            0, 1, 2,
            1, 3, 2
        ]);
        return new SharedMesh({
            id,
            vertices,
            indices,
            stride: 6 * Float32Array.BYTES_PER_ELEMENT,
            attributes: [
                { semantic: 'position', size: 4, offset: 0 },
                { semantic: 'uv', size: 2, offset: 4 * Float32Array.BYTES_PER_ELEMENT },
            ],
        });
    }
    static makeRhombus(id = 'rhombus') {
        const vertices = new Float32Array([
            0.5, 0.0, 0, 1, 0.5, 0.0,
            1.0, 0.5, 0, 1, 1.0, 0.5,
            0.5, 1.0, 0, 1, 0.5, 1.0,
            0.0, 0.5, 0, 1, 0.0, 0.5,
        ]);
        const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
        ]);
        return new SharedMesh({
            id,
            vertices,
            indices,
            stride: 6 * Float32Array.BYTES_PER_ELEMENT,
            attributes: [
                { semantic: 'position', size: 4, offset: 0 },
                { semantic: 'uv', size: 2, offset: 4 * Float32Array.BYTES_PER_ELEMENT },
            ],
        });
    }
}
