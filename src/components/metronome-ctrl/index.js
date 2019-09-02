import { Subscription } from 'sea';
import BaseComponent from '../primitives/util/base-component';
import { eventBus } from '../../services/EventBus';
import style from './metronome-ctrl.css';
import markup from './metronome-ctrl.html';

export default class Metronome extends BaseComponent {
  static get tag() {
    return 'metronome-ctrl';
  }

  constructor() {
    super(style, markup, ['toggleButton']);
    this.escapeKeySubscription = new Subscription('KEY_SHORTCUT', (msg) => {
      if (msg.shortcut !== 'KEY_SPACE') {
        return;
      }
      this.dom.toggleButton.click();
    });
  }

  connectedCallback() {
    eventBus.subscribe(this.escapeKeySubscription);
  }

  disconnectedCallback() {
    eventBus.unsubscribe(this.escapeKeySubscription);
  }

  handleToggle(event) {
    const customEvent = new CustomEvent(event.target.isOn ? 'CLOCK_START' : 'CLOCK_STOP');
    document.dispatchEvent(customEvent);
  }

  handleTempoChange(event) {
    const tempo = parseInt(event.target.value, 10);
    console.log('TODO: handleTempChange', tempo);
    // metronomeManager.getMetronome().setTempo(value);
  }
}
