import LiveDom from 'live-dom';
import BaseComponent from '../primitives/util/base-component';
import markup from './editor-root.html';
import styles from './editor-root.css';

export default class EditorRoot extends BaseComponent {
  static get tag() {
    return 'editor-root';
  }

  constructor() {
    super(styles, markup, [ 'editorTab' ]);
  }

  connectedCallback() {
    const domNode = document.createElement('div');
    document.body.appendChild(domNode)
    this.liveDom = new LiveDom({ domNode });
    this.dom.editorTab.setDelegate({
      handleSubmit: val => {
        console.log('handleSubmit', val)
        this.liveDom.setHtml(val);
      }
    });
  }
}
