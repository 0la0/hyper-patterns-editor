import BaseComponent from '../primitives/util/base-component';
import dataStore from '../../services/Store';
import style from './settings-editor.css';
import markup from './settings-editor.html';

const defaultSettings = {
  fontSize: 24,
  graphicsAreOn: false,
};

export default class SettingsEditor extends BaseComponent {
  static get tag() {
    return 'settings-editor';
  }

  constructor(closeCallback) {
    super(style, markup, [ 'version', ]);
    this.handleClose = closeCallback;
    this.dom.version.innerText = VERSION;
  }

  connectedCallback() {
    dataStore.setValue({ ...defaultSettings, });
  }

  handleFontSizeChange(event) {
    const fontSize = parseInt(event.target.value, 10);
    dataStore.setValue({ fontSize });
  }

  handleGraphicsToggle(event) {
    dataStore.setValue({ graphicsAreOn: event.target.value });
  }
}
