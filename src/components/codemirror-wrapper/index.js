import CodeMirror from 'codemirror';
import { Observer } from 'sea';
import dataStore  from '../../services/Store';
import BaseComponent from '../primitives/util/base-component';
import markup from './editor-root.html';
import componentStyles from './editor-root.css';
import codeMirrorStylesheet from './code-mirror-stylesheet.css';
import codeMirrorTheme from './code-mirror-theme.css';
import codeMirrorStyleOverrides from './code-mirror-overrides.css';

const styles = `${componentStyles} ${codeMirrorStylesheet} ${codeMirrorTheme} ${codeMirrorStyleOverrides}`;

const defaultEditorOptions = {
  mode: 'jsx',
  autoCloseBrackets: true,
  matchBrackets: true,
  lineWrapping: false,
  tabSize: 2,
  lineNumbers: true,
  cursorBlinkRate: 530,
  styleActiveLine: true,
  autofocus: true,
  theme: 'tomorrow-night-bright',
};

export default class CodeMirrorWrapper extends BaseComponent {
  static get tag() {
    return 'codemirror-wrapper';
  }

  constructor(contentManager) {
    super(styles, markup, [ 'editorContainer' ]);
    if (!contentManager) {
      throw new Error('CodeMirrorWrapper requires a content manager');
    }
    this.contentManager = contentManager;
    this.fontSizeObserver = new Observer(fontSize => {
      this.dom.cm && this.dom.cm.style.setProperty('font-size', `${fontSize}px`);
    });
  }

  connectedCallback() {
    const codeMirrorOptions = {
      ...defaultEditorOptions,
      extraKeys: {
        'Ctrl-Enter': cm => this.contentManager.setHtml(cm.getValue())
      },
      value: this.contentManager.getValue(),
    };
    this.codeMirror = new CodeMirror(this.dom.editorContainer, codeMirrorOptions);
    this.codeMirror.setSize('100%', '100%');
    dataStore.fontSize.observe(this.fontSizeObserver);
    setTimeout(() => {
      this.codeMirror.refresh();
      this.dom.cm = this.dom.editorContainer.children[0];
    });
  }

  disconnectedCallback() {
    dataStore.fontSize.removeObserver(this.fontSizeObserver);
  }

  focus() {
    requestAnimationFrame(() => this.codeMirror.refresh());
  }
}
