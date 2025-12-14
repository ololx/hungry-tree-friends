export class Vector2d {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }
    static ofXY(x, y) {
        return new Vector2d(x, y);
    }
    static ofX(x) {
        return new Vector2d(x, 0);
    }
    static ofY(y) {
        return new Vector2d(0, y);
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    add(vector) {
        return Vector2d.ofXY(this._x + vector.x, this._y + vector.y);
    }
    subtract(vector) {
        return Vector2d.ofXY(this._x - vector.x, this._y - vector.y);
    }
    multiply(scalar) {
        return Vector2d.ofXY(this._x * scalar, this._y * scalar);
    }
    divide(scalar) {
        if (scalar === 0) {
            throw new Error("Cannot divide by zero");
        }
        return Vector2d.ofXY(this._x / scalar, this._y / scalar);
    }
    length() {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }
    normalize() {
        const len = this.length();
        if (len === 0) {
            return Vector2d.ofXY(0, 0);
        }
        return this.divide(len);
    }
    dot(vector) {
        return this._x * vector.x + this._y * vector.y;
    }
    toString() {
        return `(${this._x}, ${this._y})`;
    }
    equals(vector) {
        return this._x === vector.x && this._y === vector.y;
    }
}
