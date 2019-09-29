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
    this.keyShortcutSubscription = new Subscription('KEY_SHORTCUT', (msg) => {
      if (msg.shortcut === 'TAB_NAV_LEFT') {
        this.tabShift(-1);
        return;
      }
      if (msg.shortcut === 'TAB_NAV_RIGHT') {
        this.tabShift(1);
        return;
      }
      if (msg.shortcut === 'NEW_EDITOR_WINDOW') {
        this.addTab();
      }
    });
    this.activeTab;
    this.dom.addAudioTab.addEventListener('click', this.addAudioTab.bind(this));
    this.dom.addGraphicsTab.addEventListener('click', this.addGraphicsTab.bind(this));
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

  addAudioTab(tabId = uuid(), defaultValue = '') {
    this.addTab(new AudioTab(tabId, defaultValue));
  }

  addGraphicsTab(tabId = uuid(), defaultValue = '') {
    this.addTab(new GraphicsTab(tabId, defaultValue));
  }

  addTab(contentManager, defaultValue = '') {
    const tabWindow = new TabWindow({
      label: `tab${this.dom.tabContainer.children.length + 1}`,
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
    const storedTabs = store.tabs.value;
    // TODO: destroy all tabs 
    Object.keys(storedTabs).forEach(tabId => {
      console.log('storedTabId:', tabId);
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
        this.addAudioTab(tabId, decodedValue);
      } else if (tab.type === 'GRAPHICS') {
        this.addGraphicsTab(tabId, decodedValue);
      } else {
        console.error(`Unrecognized tab type: ${tab.type}`);
      }
    });
  }
}
