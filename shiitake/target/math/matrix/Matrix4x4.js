export class Matrix4x4 {
    constructor(values) {
        if (values.length !== 16) {
            throw new Error("Matrix 4x4 must be initialized with 16 values.");
        }
        this._a = new Float32Array(values);
    }
    add(matrix) {
        const b = matrix.toArray();
        const ab = new Float32Array(16);
        ab[0] = this._a[0] + b[0];
        ab[1] = this._a[1] + b[1];
        ab[2] = this._a[2] + b[2];
        ab[3] = this._a[3] + b[3];
        ab[4] = this._a[4] + b[4];
        ab[5] = this._a[5] + b[5];
        ab[6] = this._a[6] + b[6];
        ab[7] = this._a[7] + b[7];
        ab[8] = this._a[8] + b[8];
        ab[9] = this._a[9] + b[9];
        ab[10] = this._a[10] + b[10];
        ab[11] = this._a[11] + b[11];
        ab[12] = this._a[12] + b[12];
        ab[13] = this._a[13] + b[13];
        ab[14] = this._a[14] + b[14];
        ab[15] = this._a[15] + b[15];
        return new Matrix4x4(ab);
    }
    subtract(matrix) {
        const b = matrix.toArray();
        const ab = new Float32Array(16);
        ab[0] = this._a[0] - b[0];
        ab[1] = this._a[1] - b[1];
        ab[2] = this._a[2] - b[2];
        ab[3] = this._a[3] - b[3];
        ab[4] = this._a[4] - b[4];
        ab[5] = this._a[5] - b[5];
        ab[6] = this._a[6] - b[6];
        ab[7] = this._a[7] - b[7];
        ab[8] = this._a[8] - b[8];
        ab[9] = this._a[9] - b[9];
        ab[10] = this._a[10] - b[10];
        ab[11] = this._a[11] - b[11];
        ab[12] = this._a[12] - b[12];
        ab[13] = this._a[13] - b[13];
        ab[14] = this._a[14] - b[14];
        ab[15] = this._a[15] - b[15];
        return new Matrix4x4(ab);
    }
    multiply(operand) {
        if (typeof operand === "number") {
            return this._multiplyScalar(operand);
        }
        else {
            return this._multiplyMatrix(operand);
        }
    }
    _multiplyScalar(scalar) {
        const as = new Float32Array(16);
        as[0] = this._a[0] * scalar;
        as[1] = this._a[1] * scalar;
        as[2] = this._a[2] * scalar;
        as[3] = this._a[3] * scalar;
        as[4] = this._a[4] * scalar;
        as[5] = this._a[5] * scalar;
        as[6] = this._a[6] * scalar;
        as[7] = this._a[7] * scalar;
        as[8] = this._a[8] * scalar;
        as[9] = this._a[9] * scalar;
        as[10] = this._a[10] * scalar;
        as[11] = this._a[11] * scalar;
        as[12] = this._a[12] * scalar;
        as[13] = this._a[13] * scalar;
        as[14] = this._a[14] * scalar;
        as[15] = this._a[15] * scalar;
        return new Matrix4x4(as);
    }
    _multiplyMatrix(matrix) {
        const b = matrix.toArray();
        const c = new Float32Array(16);
        c[0] = this._a[0] * b[0] + this._a[1] * b[4] + this._a[2] * b[8] + this._a[3] * b[12];
        c[1] = this._a[0] * b[1] + this._a[1] * b[5] + this._a[2] * b[9] + this._a[3] * b[13];
        c[2] = this._a[0] * b[2] + this._a[1] * b[6] + this._a[2] * b[10] + this._a[3] * b[14];
        c[3] = this._a[0] * b[3] + this._a[1] * b[7] + this._a[2] * b[11] + this._a[3] * b[15];
        c[4] = this._a[4] * b[0] + this._a[5] * b[4] + this._a[6] * b[8] + this._a[7] * b[12];
        c[5] = this._a[4] * b[1] + this._a[5] * b[5] + this._a[6] * b[9] + this._a[7] * b[13];
        c[6] = this._a[4] * b[2] + this._a[5] * b[6] + this._a[6] * b[10] + this._a[7] * b[14];
        c[7] = this._a[4] * b[3] + this._a[5] * b[7] + this._a[6] * b[11] + this._a[7] * b[15];
        c[8] = this._a[8] * b[0] + this._a[9] * b[4] + this._a[10] * b[8] + this._a[11] * b[12];
        c[9] = this._a[8] * b[1] + this._a[9] * b[5] + this._a[10] * b[9] + this._a[11] * b[13];
        c[10] = this._a[8] * b[2] + this._a[9] * b[6] + this._a[10] * b[10] + this._a[11] * b[14];
        c[11] = this._a[8] * b[3] + this._a[9] * b[7] + this._a[10] * b[11] + this._a[11] * b[15];
        c[12] = this._a[12] * b[0] + this._a[13] * b[4] + this._a[14] * b[8] + this._a[15] * b[12];
        c[13] = this._a[12] * b[1] + this._a[13] * b[5] + this._a[14] * b[9] + this._a[15] * b[13];
        c[14] = this._a[12] * b[2] + this._a[13] * b[6] + this._a[14] * b[10] + this._a[15] * b[14];
        c[15] = this._a[12] * b[3] + this._a[13] * b[7] + this._a[14] * b[11] + this._a[15] * b[15];
        return new Matrix4x4(c);
    }
    transpose() {
        const c = new Float32Array(16);
        c[0] = this._a[0];
        c[1] = this._a[4];
        c[2] = this._a[8];
        c[3] = this._a[12];
        c[4] = this._a[1];
        c[5] = this._a[5];
        c[6] = this._a[9];
        c[7] = this._a[13];
        c[8] = this._a[2];
        c[9] = this._a[6];
        c[10] = this._a[10];
        c[11] = this._a[14];
        c[12] = this._a[3];
        c[13] = this._a[7];
        c[14] = this._a[11];
        c[15] = this._a[15];
        return new Matrix4x4(c);
    }
    invert() {
        const det = this.determinant();
        if (det === 0) {
            throw new Error("Matrix is not invertible (det = 0).");
        }
        const a00 = this._a[0], a01 = this._a[1], a02 = this._a[2], a03 = this._a[3];
        const a10 = this._a[4], a11 = this._a[5], a12 = this._a[6], a13 = this._a[7];
        const a20 = this._a[8], a21 = this._a[9], a22 = this._a[10], a23 = this._a[11];
        const a30 = this._a[12], a31 = this._a[13], a32 = this._a[14], a33 = this._a[15];
        const normalDet = 1.0 / det;
        const { b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11 } = this._computeMinors();
        const c = new Float32Array(16);
        c[0] = (a11 * b11 - a12 * b10 + a13 * b09) * normalDet;
        c[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * normalDet;
        c[2] = (a31 * b05 - a32 * b04 + a33 * b03) * normalDet;
        c[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * normalDet;
        c[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * normalDet;
        c[5] = (a00 * b11 - a02 * b08 + a03 * b07) * normalDet;
        c[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * normalDet;
        c[7] = (a20 * b05 - a22 * b02 + a23 * b01) * normalDet;
        c[8] = (a10 * b10 - a11 * b08 + a13 * b06) * normalDet;
        c[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * normalDet;
        c[10] = (a30 * b04 - a31 * b02 + a33 * b00) * normalDet;
        c[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * normalDet;
        c[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * normalDet;
        c[13] = (a00 * b09 - a01 * b07 + a02 * b06) * normalDet;
        c[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * normalDet;
        c[15] = (a20 * b03 - a21 * b01 + a22 * b00) * normalDet;
        return new Matrix4x4(c);
    }
    determinant() {
        const { b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11 } = this._computeMinors();
        return b00 * b11
            - b01 * b10
            + b02 * b09
            + b03 * b08
            - b04 * b07
            + b05 * b06;
    }
    _computeMinors() {
        const a00 = this._a[0], a01 = this._a[1], a02 = this._a[2], a03 = this._a[3];
        const a10 = this._a[4], a11 = this._a[5], a12 = this._a[6], a13 = this._a[7];
        const a20 = this._a[8], a21 = this._a[9], a22 = this._a[10], a23 = this._a[11];
        const a30 = this._a[12], a31 = this._a[13], a32 = this._a[14], a33 = this._a[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        return {
            b00, b01, b02, b03, b04, b05,
            b06, b07, b08, b09, b10, b11
        };
    }
    toArray() {
        return new Float32Array(this._a);
    }
}
