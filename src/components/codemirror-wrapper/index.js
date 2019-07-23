import CodeMirror from 'codemirror';
import BaseComponent from '../primitives/util/base-component';
import Subscription from '../../services/EventBus/Subscription';
import { eventBus } from '../../services/EventBus';
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
  extraKeys: {},
};

export default class CodeMirrorWrapper extends BaseComponent {
  static get tag() {
    return 'codemirror-wrapper';
  }

  constructor(handleSubmit, textContent = '') {
    super(styles, markup, [ 'editorContainer' ]);
    this.handleSubmit = handleSubmit || (() => console.log('Submit not defined'));
    this.dataStoreSubscription = new Subscription('DATA_STORE', this.handleDataStoreUpdate.bind(this));
    this.textContent = textContent;
  }

  connectedCallback() {
    const codeMirrorOptions = {
      ...defaultEditorOptions,
      extraKeys: {
        'Ctrl-N': cm => console.log('ctrl-n', cm),
        'Ctrl-[': cm => console.log('ctrl-[', cm),
        'Ctrl-]': cm => console.log('ctrl-]', cm),
        'Ctrl-]': cm => console.log('ctrl-]', cm),
        'Ctrl-/': cm => console.log('ctrl-/', cm),
        'Ctrl-Enter': cm => this.handleSubmit(cm.getValue())
      },
      value: this.textContent,
    };
    this.codeMirror = CodeMirror(this.dom.editorContainer, codeMirrorOptions);
    this.codeMirror.setSize('100%', '100%');
    eventBus.subscribe(this.dataStoreSubscription);
    setTimeout(() => {
      this.codeMirror.refresh();
      this.dom.cm = this.dom.editorContainer.children[0];
    });
  }

  handleDataStoreUpdate(obj) {
    if (!obj.dataStore || !obj.dataStore.fontSize) {
      return;
    }
    this.dom.cm.style.setProperty('font-size', `${obj.dataStore.fontSize}px`);
  }
}
