export class SharedMaterial {
    constructor(props) {
        var _a, _b, _c, _d;
        this.id = props.id;
        this.shader = props.shader;
        this.textureName = props.textureName;
        this.color = (_a = props.color) !== null && _a !== void 0 ? _a : [1, 1, 1, 1];
        this.depthTest = (_b = props.depthTest) !== null && _b !== void 0 ? _b : false;
        this.depthWrite = (_c = props.depthWrite) !== null && _c !== void 0 ? _c : false;
        this.blendMode = (_d = props.blendMode) !== null && _d !== void 0 ? _d : 'alpha';
    }
}
