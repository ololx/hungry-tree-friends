export class EventBus {
    constructor() {
        this.listeners = new Map();
    }
    on(event, handler) {
        let set = this.listeners.get(event);
        if (!set) {
            set = new Set();
            this.listeners.set(event, set);
        }
        set.add(handler);
        return () => this.off(event, handler);
    }
    once(event, handler) {
        const wrapped = (...args) => {
            this.off(event, wrapped);
            handler(...args);
        };
        return this.on(event, wrapped);
    }
    off(event, handler) {
        const set = this.listeners.get(event);
        if (!set)
            return;
        set.delete(handler);
        if (set.size === 0)
            this.listeners.delete(event);
    }
    emit(event, ...args) {
        const set = this.listeners.get(event);
        if (!set || set.size === 0)
            return;
        for (const fn of Array.from(set)) {
            fn(...args);
        }
    }
    clear(event) {
        if (event !== undefined) {
            this.listeners.delete(event);
            return;
        }
        this.listeners.clear();
    }
    listenerCount(event) {
        var _a, _b;
        if (event !== undefined)
            return (_b = (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0;
        let n = 0;
        for (const set of this.listeners.values())
            n += set.size;
        return n;
    }
}
