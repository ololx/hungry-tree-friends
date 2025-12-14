export class Game {
    constructor(world, input, updateSystems, renderSystems) {
        this.world = world;
        this.input = input;
        this.updateSystems = updateSystems.sort((a, b) => (a?.priority ?? 0) - (b?.priority ?? 0));
        this.renderSystems = renderSystems.sort((a, b) => (a?.priority ?? 0) - (b?.priority ?? 0));
    }

    processInput(_tick) {
    }

    processUpdate(tick) {
        if (!tick.isActive) return;
        this.updateSystems.forEach((s) => s.update(this.world, tick));
    }

    processRender(tick) {
        this.renderSystems.forEach((s) => s.update(this.world, tick));
    }
}
