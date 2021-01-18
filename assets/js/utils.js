import * as ECSY from "ecsy";

/**
 * @param {ECSY.Entity} entity
 * @param {ECSY.ComponentConstructor<any>} Component
 * @param {any} data
 */
export function replaceComponent(entity, Component, data) {
  if (entity.hasComponent(Component)) {
    entity.removeComponent(Component);
  }
  entity.addComponent(Component, data);
}

/**
 * @param {Map<any, any>} target
 * @param {Map<any, any>} source
 */
export function copyMap(target, source) {
  source.forEach((value, key) => {
    target.set(key, value);
  });
}