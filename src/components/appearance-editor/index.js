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
    this.fontSizeObserver = new Observer(fontSize =>
      this.dom.fontSizeInput.setAttribute('value', fontSize));
  }

  connectedCallback() {
    dataStore.fontSize.observe(this.fontSizeObserver);
  }

  disconnectedCallback() {
    dataStore.fontSize.removeObserver(this.fontSizeObserver);
  }

  handleFontSizeChange(event) {
    const fontSize = parseInt(event.target.value, 10);
    dataStore.fontSize.setValue(fontSize);
  }
}
