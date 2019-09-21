import BaseComponent from '../primitives/util/base-component';
import style from './settings-editor.css';
import markup from './settings-editor.html';

export default class SettingsEditor extends BaseComponent {
  static get tag() {
    return 'settings-editor';
  }

  constructor() {
    super(style, markup, [ 'appearance', 'graphics', 'version', ]);
    this.dom.version.innerText = VERSION;
    this.editorContainers = [
      this.dom.appearance,
      this.dom.graphics,
    ];
    this.openEditor = false;
  }

  setCloseCallback(closeCallback) {
    this.closeCallback = closeCallback;
  }

  handleClose(event) {
    this.closeCallback && this.closeCallback(event);
  }
}
