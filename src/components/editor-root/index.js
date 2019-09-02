import { Subscription, Observer } from 'sea';
import BaseComponent from '../primitives/util/base-component';
import EditorState from './EditorState';
import { eventBus, } from '../../services/EventBus';
import GlobalListeners from '../../services/GlobalListeners';
import dataStore  from '../../services/Store';
import markup from './editor-root.html';
import style from './editor-root.css';

export default class EditorRoot extends BaseComponent {
  static get tag() {
    return 'editor-root';
  }

  constructor() {
    super(style, markup, [ 'midiButton', 'sampleButton', 'settingsButton', 'toggleButton' ]);
    this.editorState = new EditorState({
      midiButton: this.dom.midiButton,
      sampleButton: this.dom.sampleButton,
      settingsButton: this.dom.settingsButton,
      closeCallback: () => dataStore.setting.setValue('OFF')
    });
    this.shadowRoot.appendChild(this.editorState.midi);
    this.shadowRoot.appendChild(this.editorState.sample);
    this.shadowRoot.appendChild(this.editorState.settings);
    this.settingStateObserver = new Observer(editorDrawer => this.editorState.render(editorDrawer));
    this.escapeKeySubscription = new Subscription('KEY_SHORTCUT', (msg) => {
      if (msg.shortcut !== 'KEY_ESCAPE') {
        return;
      }
      dataStore.setting.setValue('OFF');
    });
  }

  connectedCallback() {
    GlobalListeners.init();
    dataStore.setting.observe(this.settingStateObserver);
    eventBus.subscribe(this.escapeKeySubscription);
  }

  disconnectedCallback() {
    GlobalListeners.tearDown();
    dataStore.setting.unobserve(this.settingStateObserver);
    eventBus.unsubscribe(this.escapeKeySubscription);
  }

  handleMidiClick(event) {
    dataStore.setting.setValue(event.target.isOn ? 'MIDI' : 'OFF');
  }

  handleSampleClick(event) {
    dataStore.setting.setValue(event.target.isOn ? 'SAMPLE' : 'OFF');
  }

  handleSettingsClick(event) {
    dataStore.setting.setValue(event.target.isOn ? 'SETTINGS' : 'OFF');
  }
}
