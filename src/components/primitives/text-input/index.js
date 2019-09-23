import BaseComponent from '../util/base-component';
import {
  reflectAttribute,
  reflectCallback
} from '../util/dom';
import style from './text-input.css';

// const attributeReflectionList = [ 'type', 'value', 'min', 'max' ];

export default class TextInput extends BaseComponent {
  static get tag() {
    return 'text-input';
  }

  static get observedAttributes() {
    return [ 'type', 'value', 'min', 'max' ];
  }

  constructor() {
    super(
      style,
      '<input id="textInput" class="text-input"/>',
      ['textInput']
    );
  }

  connectedCallback() {
    TextInput.observedAttributes.forEach(attributeName =>
      reflectAttribute(this, attributeName, this.dom.textInput));
    reflectCallback(this, 'change', this.dom.textInput);
    if (this.getAttribute('textAlign') === 'left') {
      this.dom.textInput.classList.add('align-left');
    }
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.dom.textInput.setAttribute(attrName, newVal);
  }
}
