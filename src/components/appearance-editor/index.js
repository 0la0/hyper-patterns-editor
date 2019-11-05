import { Observer } from 'sea';
import BaseComponent from '../primitives/util/base-component';
import dataStore  from '../../services/Store';
import style from './appearance-editor.css';
import markup from './appearance-editor.html';

export default class AppearanceEditor extends BaseComponent {
  static get tag() {
    return 'appearance-editor';
  }

  constructor() {
    super(style, markup, [ 'fontSizeInput' ]);
    this.projectSettingsObserver = new Observer(({ fontSize, }) =>
      this.dom.fontSizeInput.setAttribute('value', fontSize));
  }

  connectedCallback() {
    dataStore.projectSettings.observe(this.projectSettingsObserver);
  }

  disconnectedCallback() {
    dataStore.projectSettings.removeObserver(this.projectSettingsObserver);
  }

  handleFontSizeChange(event) {
    const fontSize = parseInt(event.target.value, 10);
    dataStore.projectSettings.setValue({ fontSize, });
  }
}
