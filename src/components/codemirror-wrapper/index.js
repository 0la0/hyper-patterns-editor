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
const NOTIFICATION_VISIBLE = 'notification-visible';

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
    super(styles, markup, [ 'editorContainer', 'notificationPending', 'notificationError' ]);
    if (!contentManager) {
      throw new Error('CodeMirrorWrapper requires a content manager');
    }
    this.contentManager = contentManager;
    this.projectSettingsObserver = new Observer(({ fontSize }) => {
      this.dom.cm && this.dom.cm.style.setProperty('font-size', `${fontSize}px`);
      this.codeMirror.refresh();
    });
  }

  connectedCallback() {
    const codeMirrorOptions = {
      ...defaultEditorOptions,
      extraKeys: {
        'Ctrl-Enter': () => this.submit(),
      },
      value: this.contentManager.getValue(),
    };
    this.codeMirror = new CodeMirror(this.dom.editorContainer, codeMirrorOptions);
    this.codeMirror.setSize('100%', '100%');
    this.codeMirror.on('change', cm => {
      const isPending = this.contentManager.getValue() !== cm.getValue();
      requestAnimationFrame(() => {
        isPending ?
          this.dom.notificationPending.classList.add(NOTIFICATION_VISIBLE) :
          this.dom.notificationPending.classList.remove(NOTIFICATION_VISIBLE);
      });
    });
    dataStore.projectSettings.observe(this.projectSettingsObserver);
    setTimeout(() => {
      const { fontSize } = dataStore.projectSettings.value;
      this.codeMirror.refresh();
      this.dom.cm = this.dom.editorContainer.children[0];
      this.dom.cm.style.setProperty('font-size', `${fontSize}px`);
    });
  }

  disconnectedCallback() {
    dataStore.projectSettings.removeObserver(this.projectSettingsObserver);
  }

  focus() {
    requestAnimationFrame(() => {
      this.codeMirror.refresh();
      this.codeMirror.focus();
    });
  }

  submit() {
    const result = this.contentManager.setHtml(this.codeMirror.getValue());
    requestAnimationFrame(() => {
      this.dom.notificationPending.classList.remove(NOTIFICATION_VISIBLE);
      if (result.ok) {
        this.dom.notificationError.classList.remove(NOTIFICATION_VISIBLE)
      } else {
        this.dom.notificationError.classList.add(NOTIFICATION_VISIBLE);
        this.dom.notificationError.innerText = result.message;
      }
    });
  }
}
