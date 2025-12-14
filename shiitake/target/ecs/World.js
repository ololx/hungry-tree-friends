import { Entity } from "./Entity.js";
export class World {
    constructor() {
        this.entities = new Map();
        this.freeIds = [];
        this.nextId = 1;
    }
    createEntity(name = "Entity") {
        const id = this.freeIds.length > 0 ? this.freeIds.pop() : this.nextId++;
        const e = Entity.__create(id, name);
        this.entities.set(id, e);
        return id;
    }
    renameEntity(id, name) {
        const e = this.entities.get(id);
        if (!e)
            return false;
        e.name = name;
        return true;
    }
    destroyEntity(id) {
        const existed = this.entities.delete(id);
        if (existed)
            this.freeIds.push(id);
        return existed;
    }
    hasEntity(id) {
        return this.entities.has(id);
    }
    count() {
        return this.entities.size;
    }
    addComponent(id, key, c) {
        const e = this.entities.get(id);
        if (!e)
            return false;
        e.__add(key, c);
        return true;
    }
    getComponent(id, key) {
        var _a;
        return (_a = this.entities.get(id)) === null || _a === void 0 ? void 0 : _a.__get(key);
    }
    hasComponent(id, key) {
        var _a, _b;
        return (_b = (_a = this.entities.get(id)) === null || _a === void 0 ? void 0 : _a.__has(key)) !== null && _b !== void 0 ? _b : false;
    }
    removeComponent(id, key) {
        const e = this.entities.get(id);
        return e ? e.__remove(key) : false;
    }
    listComponents(id) {
        var _a, _b;
        return (_b = (_a = this.entities.get(id)) === null || _a === void 0 ? void 0 : _a.__listKeys()) !== null && _b !== void 0 ? _b : [];
    }
    queryByComponentsIds(...keys) {
        const out = [];
        for (const [id, e] of this.entities) {
            let ok = true;
            for (const k of keys) {
                if (!e.__has(k)) {
                    ok = false;
                    break;
                }
            }
            if (ok)
                out.push(id);
        }
        return out;
    }
    firstByComponentsId(...keys) {
        for (const [id, e] of this.entities) {
            let ok = true;
            for (const k of keys) {
                if (!e.__has(k)) {
                    ok = false;
                    break;
                }
            }
            if (ok)
                return id;
        }
        return undefined;
    }
    forEach(callback) {
        for (const id of this.entities.keys())
            callback(id);
    }
    clear({ resetIds = false } = {}) {
        this.entities.clear();
        if (resetIds) {
            this.freeIds.length = 0;
            this.nextId = 1;
        }
    }
}
