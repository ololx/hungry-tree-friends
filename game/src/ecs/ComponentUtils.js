export function withComponent(world, entityId, componentName, func) {
    const component = world.getComponent(entityId, componentName);
    if (!component) {
      return;
    }

    func(component);
}
