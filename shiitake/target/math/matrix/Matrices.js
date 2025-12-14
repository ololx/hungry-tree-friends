import { Matrix4x4 } from "./Matrix4x4.js";
export class Matrices {
    static multiply(...matrices) {
        if (matrices.length === 0) {
            return Matrices.matrix4x4.identity();
        }
        let result = matrices[0];
        for (let i = 1; i < matrices.length; i++) {
            result = matrices[i].multiply(result);
        }
        return result;
    }
}
Matrices.matrix4x4 = class {
    static identity() {
        return new Matrix4x4(new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]));
    }
    static translation(tx, ty, tz) {
        return new Matrix4x4(new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ]));
    }
    static scaling(sx, sy, sz) {
        return new Matrix4x4(new Float32Array([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ]));
    }
    static rotationX(angle) {
        const c = Math.cos(angle), s = Math.sin(angle);
        return new Matrix4x4(new Float32Array([
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ]));
    }
    static rotationY(angle) {
        const c = Math.cos(angle), s = Math.sin(angle);
        return new Matrix4x4(new Float32Array([
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        ]));
    }
    static rotationZ(angle) {
        const c = Math.cos(angle), s = Math.sin(angle);
        return new Matrix4x4(new Float32Array([
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]));
    }
    static orthographic(left, right, bottom, top, near = 0, far = 1) {
        const lr = 1 / (right - left);
        const bt = 1 / (top - bottom);
        const nf = 1 / (near - far);
        return new Matrix4x4(new Float32Array([
            2 * lr, 0, 0, 0,
            0, -2 * bt, 0, 0,
            0, 0, nf, 0,
            -(right + left) * lr,
            -(top + bottom) * bt,
            near * nf,
            1
        ]));
    }
    static perspective(fovY, aspect, near, far) {
        const f = 1 / Math.tan(fovY / 2);
        const nf = 1 / (near - far);
        return new Matrix4x4(new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, far * nf, -1,
            0, 0, near * far * nf, 0
        ]));
    }
    static lookAt(ex, ey, ez, tx, ty, tz, upx = 0, upy = 1, upz = 0) {
        let zx = ex - tx, zy = ey - ty, zz = ez - tz;
        const zl = Math.hypot(zx, zy, zz) || 1;
        zx /= zl;
        zy /= zl;
        zz /= zl;
        let xx = upy * zz - upz * zy, xy = upz * zx - upx * zz, xz = upx * zy - upy * zx;
        const xl = Math.hypot(xx, xy, xz) || 1;
        xx /= xl;
        xy /= xl;
        xz /= xl;
        const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
        return new Matrix4x4(new Float32Array([
            xx, yx, zx, 0,
            xy, yy, zy, 0,
            xz, yz, zz, 0,
            -(xx * ex + xy * ey + xz * ez),
            -(yx * ex + yy * ey + yz * ez),
            -(zx * ex + zy * ey + zz * ez),
            1
        ]));
    }
    static model2D(x, y, z, rotation, width, height, scaleX, scaleY, pivotX = 0, pivotY = 0) {
        const ox = pivotX - 0.5;
        const oy = pivotY - 0.5;
        const T = this.translation(x, y, z);
        const Tp = this.translation(pivotX, pivotY, 0);
        const R = this.rotationZ(rotation);
        const S = this.scaling(width * scaleX, height * scaleY, 1);
        const TmP = this.translation(-pivotX, -pivotY, 0);
        return Matrices.multiply(T, Tp, R, S, TmP);
    }
    static view2D(camX, camY, camZ, camRot, camScaleX = 1, camScaleY = 1) {
        const Si = this.scaling(1 / (camScaleX || 1), 1 / (camScaleY || 1), 1);
        const Ri = this.rotationZ(-camRot);
        const Ti = this.translation(-camX, -camY, -camZ);
        return Matrices.multiply(Si, Ri, Ti);
    }
    static orthoBySize(width, height) {
        const hw = width / 2, hh = height / 2;
        return this.orthographic(-hw, hw, -hh, hh, 0, 1);
    }
};
