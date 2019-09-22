import { eventBus } from './EventBus';
import keyShortcutManager from './keyShortcut';

class Listener {
  constructor(name, handler) {
    this.name = name;
    this.handler = handler;
  }
}

const listeners = [
  new Listener('keydown', event => keyShortcutManager.offerKeyShortcutEvent(event)),
  new Listener('resize', event => eventBus.publish({ address: 'RESIZE', event }))
];

export default class GlobalListeners {
  static init() {
    listeners.forEach(listener => window.addEventListener(listener.name, listener.handler));
  }

  static tearDown() {
    listeners.forEach(listener => window.removeEventListener(listener.name, listener.handler));
  }
}
