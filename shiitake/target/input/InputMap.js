export class InputMap {
    constructor() {
        this.bindings = new Map();
    }
    bind(action, tokens) {
        const arr = Array.isArray(tokens) ? tokens : [tokens];
        const unique = Array.from(new Set(arr));
        this.bindings.set(action, unique);
    }
    unbind(action) {
        this.bindings.delete(action);
    }
    getTokens(action) {
        return this.bindings.get(action);
    }
    actions() {
        return this.bindings.keys();
    }
}
