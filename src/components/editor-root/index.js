import { Subscription } from 'sea';
import BaseComponent from '../primitives/util/base-component';
import { eventBus, } from '../../services/EventBus';
import GlobalListeners from '../../services/GlobalListeners';
import markup from './editor-root.html';
import style from './editor-root.css';

const editorVisible = 'settings-visible';
const scrimVisible = 'settings-scrim-visible';

export default class EditorRoot extends BaseComponent {
  static get tag() {
    return 'editor-root';
  }

  constructor() {
    super(style, markup, [ 'scrim', 'settingsEditor', 'settingsButton', ]);

    this.openEditor = () => {
      this.dom.scrim.classList.add(scrimVisible);
      this.dom.settingsEditor.classList.add(editorVisible);
    };
    this.closeEditor = () => {
      this.dom.scrim.classList.remove(scrimVisible);
      this.dom.settingsEditor.classList.remove(editorVisible);
      this.dom.settingsButton.turnOff();
    };

    this.escapeKeySubscription = new Subscription('KEY_SHORTCUT', (msg) => {
      if (msg.shortcut !== 'KEY_ESCAPE') { return; }
      this.closeEditor();
    });
  }

  connectedCallback() {
    GlobalListeners.init();
    eventBus.subscribe(this.escapeKeySubscription);
    this.dom.settingsEditor.setCloseCallback(this.closeEditor);
    this.dom.scrim.addEventListener('click', this.closeEditor);
    setTimeout(() => this.dom.settingsEditor.openFromLocalStorage(true));
  }

  disconnectedCallback() {
    GlobalListeners.tearDown();
    eventBus.unsubscribe(this.escapeKeySubscription);
    this.dom.scrim.removeEventListener('click', this.closeEditor);
  }

  handleSettingsClick(event) {
    event.target.isOn ? this.openEditor() : this.closeEditor();
  }
}
