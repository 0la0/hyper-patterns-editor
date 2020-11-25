import BaseComponent from '../util/base-component';
import markup from './expandable-section.html';
import style from './expandable-section.css';

const HtmlSymbol = {
  plus: '\u2795',
  minus: '\u2796',
};

export default class ExpandableSection extends BaseComponent {
  static get tag() {
    return 'expandable-section';
  }

  constructor() {
    super(style, markup,  ['expandableButton', 'expandableContent', 'buttonLabel', 'buttonIcon']);
    this.isOpen = false;
    this.toggle = () => {
      this.isOpen = !this.isOpen;
      requestAnimationFrame(() => {
        this.isOpen ? this.open() : this.close();
      });
    };
    this.dom.expandableButton.addEventListener('click', this.toggle);
    this.dom.buttonLabel.innerText = this.getAttribute('label'); 
    this.originalChildren.forEach(childNode => this.dom.expandableContent.appendChild(childNode));
  }

  disconnectedCallback() {
    this.dom.expandableButton.removeEventListener('click', this.toggle);
  }

  open() {
    this.dom.expandableButton.classList.add('expandable-active');
    this.dom.expandableContent.classList.add('expandable-content-active');
    this.dom.buttonIcon.innerText = HtmlSymbol.minus;
    this.dom.expandableContent.style.maxHeight = `${this.dom.expandableContent.scrollHeight}px`;
  }

  close() {
    this.dom.expandableButton.classList.remove('expandable-active');
    this.dom.expandableContent.classList.remove('expandable-content-active');
    this.dom.buttonIcon.innerText = HtmlSymbol.plus;
    this.dom.expandableContent.style.maxHeight = '0px';
  }
}
