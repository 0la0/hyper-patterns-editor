import BaseComponent from '../primitives/util/base-component';
import style from './settings-editor.css';
import markup from './settings-editor.html';

export default class SettingsEditor extends BaseComponent {
  static get tag() {
    return 'settings-editor';
  }

  constructor() {
    super(style, markup, [ 'version', 'sceneEditor' ]);
    // eslint-disable-next-line no-undef
    this.dom.version.innerText = VERSION;
    this.openEditor = false;
  }

  setCloseCallback(closeCallback) {
    this.closeCallback = closeCallback;
  }

  handleClose(event) {
    this.closeCallback && this.closeCallback(event);
  }

  openFromLocalStorage() {
    this.dom.sceneEditor.openFromLocalStorage();
  }
}
