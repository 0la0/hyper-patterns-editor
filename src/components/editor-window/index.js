import { Subscription } from 'sea';
import BaseComponent from '../primitives/util/base-component';
import { eventBus } from '../../services/EventBus';
import TabWindow from './TabWindow';
import GraphicsTab from '../../services/TabModels/GraphicsTab';
import AudioTab from '../../services/TabModels/AudioTab';
import store from '../../services/Store';
import { uuid } from '../../services/Math';
import style from './editor-window.css';
import markup from './editor-window.html';

export default class EditorWindow extends BaseComponent {
  static get tag() {
    return 'editor-window';
  }

  constructor() {
    super(style, markup, [ 'addAudioTab', 'addGraphicsTab', 'tabContainer', 'contentContainer' ]);
    const eventMap = {
      TAB_NAV_LEFT: () => this.tabShift(-1),
      TAB_NAV_RIGHT: () => this.tabShift(1),
      NEW_AUDIO_TAB: () => this.addAudioTab(),
      NEW_GRAPHICS_TAB: () => this.addGraphicsTab(),
      INCREASE_FONT_SIZE: () => this.increaseFontSize(),
      DECREASE_FONT_SIZE: () => this.decreaseFontSize(),
    };
    this.keyShortcutSubscription = new Subscription('KEY_SHORTCUT', (msg) => {
      const action = eventMap[msg.shortcut];
      if (!action) { return; }
      action();
    });
    this.activeTab;
    this.dom.addAudioTab.addEventListener('click', () => this.addAudioTab());
    this.dom.addGraphicsTab.addEventListener('click', () => this.addGraphicsTab());
    this.tabs = [];
    this.onSessionOpen = this.buildFromSavedData.bind(this);
  }

  connectedCallback() {
    eventBus.subscribe(this.keyShortcutSubscription);
    document.addEventListener('SESSION_OPEN', this.onSessionOpen);
  }

  disconnectedCallback() {
    eventBus.unsubscribe(this.keyShortcutSubscription);
    document.removeEventListener('SESSION_OPEN', this.onSessionOpen);
  }

  increaseFontSize() {
    const { fontSize, } = store.projectSettings.value;
    const adjustedFontSize = fontSize + 1;
    store.projectSettings.setValue({ fontSize: adjustedFontSize, });
  }

  decreaseFontSize() {
    const { fontSize, } = store.projectSettings.value;
    if (fontSize <= 5) {
      return;
    }
    const adjustedFontSize = fontSize - 1;
    store.projectSettings.setValue({ fontSize: adjustedFontSize, });
  }

  addAudioTab(event, tabId = uuid(), defaultValue = '') {
    this.addTab(new AudioTab(tabId, defaultValue));
  }

  addGraphicsTab(event, tabId = uuid(), defaultValue = '') {
    this.addTab(new GraphicsTab(tabId, defaultValue));
  }

  addTab(contentManager, defaultValue = '') {
    const labelType = contentManager instanceof AudioTab ? '\u266A' : '\u1F58';
    const labelCount = this.dom.tabContainer.children.length + 1;
    const tabWindow = new TabWindow({
      label: `${labelType} tab ${labelCount}`,
      tabContainer: this.dom.tabContainer,
      windowContainer: this.dom.contentContainer,
      contentManager,
      onClick: this.handleTabClick.bind(this),
      onRemove: this.handleTabRemove.bind(this),
      defaultValue,
    });
    this.tabs.push(tabWindow);
    this.activeTab = tabWindow;
    this.render();
  }

  handleTabClick(tab) {
    this.activeTab = tab;
    this.render();
  }

  handleTabRemove(tab) {
    this.tabs = this.tabs.filter(_tab => _tab !== tab);
    if (tab === this.activeTab) {
      this.activeTab = this.tabs[0];
    }
    this.render();
  }

  tabShift(amount) {
    if (!this.tabs.length) {
      this.render();
      return;
    }
    if (this.tabs.length === 1) {
      this.activeTab = this.tabs[0];
      this.render();
      return;
    }
    this.tabs.some((tab, index) => {
      if (tab !== this.activeTab) {
        return false;
      }
      if (amount < 0 && index === 0) {
        this.activeTab = this.tabs[this.tabs.length - 1];
      } else {
        const activeIndex = (index + amount) % this.tabs.length;
        this.activeTab = this.tabs[activeIndex];
      }
      return true;
    });
    this.render();
  }

  render() {
    requestAnimationFrame(() =>
      this.tabs.forEach(tab => tab.setActive(tab === this.activeTab)));
  }

  buildFromSavedData() {
    this.tabs.forEach(tab => tab.handleTabRemove());
    const storedTabs = store.tabs.value; 
    Object.keys(storedTabs).forEach(tabId => {
      const tab = storedTabs[tabId];
      const { encodedValue } = tab;
      if (!encodedValue) { return; }
      let decodedValue;
      try {
        decodedValue = atob(encodedValue);
      } catch(error) {
        console.error('error', error);
        return;
      }
      if (tab.type === 'AUDIO') {
        this.addAudioTab(null, tabId, decodedValue);
      } else if (tab.type === 'GRAPHICS') {
        this.addGraphicsTab(null, tabId, decodedValue);
      } else {
        console.error(`Unrecognized tab type: ${tab.type}`);
      }
    });
  }
}
