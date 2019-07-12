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

const testValue = `
<ps-dac>
  <ps-gain value="0.1">
    <ps-env-osc wav="squ" attack="0" sustain="0" release="40" trigger="a"></ps-env-osc>
  </ps-gain>
</ps-dac>
<ps-seq>
  <ps-pat-mod speed="0.5" degrade="0.5">
    <ps-pat-midi pattern="a:52 a:60 a:65 a:72"></ps-pat-midi>
    <ps-pat-midi pattern="a a a"></ps-pat-midi>
  </ps-pat-mod>
</ps-seq>`;

const codeMirrorOptions = {
  mode: 'jsx',
  autoCloseBrackets: true,
  matchBrackets: true,
  value: testValue,
  lineWrapping: false,
  tabSize: 2,
  lineNumbers: true,
  cursorBlinkRate: 530,
  styleActiveLine: true,
  autofocus: true,
  theme: 'tomorrow-night-bright',
  extraKeys: {
    
  },
};

export default class CodeMirrorWrapper extends BaseComponent {
  static get tag() {
    return 'codemirror-wrapper';
  }

  constructor(handleSubmit) {
    super(styles, markup, [ 'editorContainer' ]);
    this.handleSubmit = handleSubmit || (() => console.log('Submit not defined'));
    this.dataStoreSubscription = new Subscription('DATA_STORE', this.handleDataStoreUpdate.bind(this));
  }

  connectedCallback() {
    const keyBindings = {
      'Ctrl-N': cm => console.log('ctrl-n', cm),
      'Ctrl-[': cm => console.log('ctrl-[', cm),
      'Ctrl-]': cm => console.log('ctrl-]', cm),
      'Ctrl-]': cm => console.log('ctrl-]', cm),
      'Ctrl-/': cm => console.log('ctrl-/', cm),
      'Ctrl-Enter': cm => this.handleSubmit(cm.getValue())
    };
    this.codeMirror = CodeMirror(this.dom.editorContainer, Object.assign(codeMirrorOptions, { extraKeys: keyBindings, }));
    this.codeMirror.setSize('100%', '100%');
    eventBus.subscribe(this.dataStoreSubscription);
    setTimeout(() => {
      this.codeMirror.refresh();
      this.dom.cm = this.dom.editorContainer.children[0];
      console.log('cm', this.dom.cm)
    });
  }

  handleDataStoreUpdate(obj) {
    if (!obj.dataStore || !obj.dataStore.fontSize) {
      return;
    }
    console.log('fontSize:', obj.dataStore.fontSize, this.codeMirror);
    this.dom.cm.style.setProperty('font-size', `${obj.dataStore.fontSize}px`);
  }
}
