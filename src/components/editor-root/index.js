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
    this.dom.editorTab.setDelegate({
      handleSubmit: val => console.log('handleSubmit', val)
    });
  }
}
