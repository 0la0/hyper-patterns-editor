import BaseComponent from '../primitives/util/base-component';
import EditorState from './EditorState';
import { eventBus, } from '../../services/EventBus';
import Subscription from '../../services/EventBus/Subscription';
import GlobalListeners from '../../services/GlobalListeners';
import dataStore from '../../services/Store';
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
      closeCallback: () => dataStore.setValue({ editorDrawer: 'OFF' })
    });
    this.shadowRoot.appendChild(this.editorState.midi);
    this.shadowRoot.appendChild(this.editorState.sample);
    this.shadowRoot.appendChild(this.editorState.settings);
    this.eventBusSubscription = new Subscription('DATA_STORE', this.handleDataStoreUpdate.bind(this));
    this.escapeKeySubscription = new Subscription('KEY_SHORTCUT', (msg) => {
      if (msg.shortcut === 'KEY_ESCAPE') {
        dataStore.setValue({ editorDrawer: 'OFF' });
      }
      if (msg.shortcut === 'KEY_SPACE') {
        this.dom.toggleButton.toggle();
      }
    });
  }

  connectedCallback() {
    GlobalListeners.init();
    eventBus.subscribe(this.eventBusSubscription);
    eventBus.subscribe(this.escapeKeySubscription);
  }

  disconnectedCallback() {
    GlobalListeners.tearDown();
    eventBus.unsubscribe(this.eventBusSubscription);
    eventBus.unsubscribe(this.escapeKeySubscription);
  }

  handleMidiClick(event) {
    dataStore.setValue({ editorDrawer: event.target.isOn ? 'MIDI' : 'OFF' });
  }

  handleSampleClick(event) {
    dataStore.setValue({ editorDrawer: event.target.isOn ? 'SAMPLE' : 'OFF' });
  }

  handleSettingsClick(event) {
    dataStore.setValue({ editorDrawer: event.target.isOn ? 'SETTINGS' : 'OFF' });
  }

  handleDataStoreUpdate(obj) {
    this.editorState.render(obj.dataStore.editorDrawer);
  }
}
