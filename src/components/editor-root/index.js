import CodeMirror from 'codemirror';
import BaseComponent from '../primitives/util/base-component';
import markup from './editor-root.html';
import styles from './editor-root.css';
import codeMirrorStylesheet from './code-mirror-stylesheet.css';

// require('codemirror/mode/javascript/javascript')
// require('codemirror/addon/hint/javascript-hint')
// require('codemirror/addon/hint/show-hint')

export default class EditorRoot extends BaseComponent {
  static get tag() {
    return 'editor-root';
  }

  constructor() {
    super(`${styles} ${codeMirrorStylesheet}`, markup, [ 'editorContainer' ]);
  }

  connectedCallback() {

    const codeMirrorOptions = {
      mode: 'html',
      autoCloseBrackets: true,
      matchBrackets: true,
      value: 'testing 1 2 3',
      lineWrapping: false,
      tabSize: 2,
      lineNumbers: true,
      cursorBlinkRate: 530,
      styleActiveLine: true,
      autofocus: false,
    };
    const codeMirror = CodeMirror(this.dom.editorContainer, codeMirrorOptions);
    codeMirror.setSize(null, 'auto');
  }
}
