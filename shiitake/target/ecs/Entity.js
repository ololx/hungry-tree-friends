export class Entity {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.components = new Map();
    }
    static __create(id, name) {
        return new Entity(id, name);
    }
    __add(key, c) {
        this.components.set(key, c);
    }
    __get(key) {
        return this.components.get(key);
    }
    __has(key) {
        return this.components.has(key);
    }
    __remove(key) {
        return this.components.delete(key);
    }
    __listKeys() {
        return Array.from(this.components.keys());
    }
}
