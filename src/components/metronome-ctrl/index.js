import { Observer, Subscription } from 'sea';
import HyperPatterns from 'hyper-patterns';
import dataStore  from '../../services/Store';
import BaseComponent from '../primitives/util/base-component';
import { eventBus } from '../../services/EventBus';
import style from './metronome-ctrl.css';
import markup from './metronome-ctrl.html';

export default class Metronome extends BaseComponent {
  static get tag() {
    return 'metronome-ctrl';
  }

  constructor() {
    super(style, markup, ['bpmInput', 'toggleButton']);
    this.escapeKeySubscription = new Subscription('KEY_SHORTCUT', (msg) => {
      if (msg.shortcut !== 'KEY_SPACE') {
        return;
      }
      this.dom.toggleButton.click();
    });
    this.bpmObserver = new Observer((bpm) => {
      this.dom.bpmInput.setAttribute('value', bpm);
      HyperPatterns.setTempo(bpm);
    });
  }

  connectedCallback() {
    eventBus.subscribe(this.escapeKeySubscription);
    dataStore.bpm.observe(this.bpmObserver);
  }

  disconnectedCallback() {
    eventBus.unsubscribe(this.escapeKeySubscription);
    dataStore.bpm.removeObserver(this.bpmObserver);
  }

  handleToggle(event) {
    const customEvent = new CustomEvent(event.target.isOn ? 'CLOCK_START' : 'CLOCK_STOP');
    document.dispatchEvent(customEvent);
  }

  handleTempoChange(event) {
    const tempo = parseInt(event.target.value, 10);
    dataStore.bpm.setValue(tempo);
  }
}
