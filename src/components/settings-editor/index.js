import BaseComponent from '../primitives/util/base-component';
import dataStore  from '../../services/Store';
import style from './settings-editor.css';
import markup from './settings-editor.html';

export default class SettingsEditor extends BaseComponent {
  static get tag() {
    return 'settings-editor';
  }

  constructor(closeCallback) {
    super(style, markup, [ 'version', ]);
    this.handleClose = closeCallback;
    this.dom.version.innerText = VERSION;
  }

  handleFontSizeChange(event) {
    const fontSize = parseInt(event.target.value, 10);
    dataStore.fontSize.setValue(fontSize);
  }

  handleGraphicsToggle(event) {
    dataStore.graphics.setValue({ isOn: event.target.value });
  }
}
