import LiveDom from 'live-dom';
import { persistTab, getPersistedValue, deleteById } from './TabPersistence';

export default class AudioTab {
  constructor(id, defaultValue = '') {
    this.id = id;
    this.liveDom = new LiveDom({ domNode: document.createElement('div') });
    document.body.appendChild(this.liveDom.domNode);
    if (defaultValue) {
      this.setHtml(defaultValue);
    }
  }

  setHtml(htmlString) {
    console.log('htmlString:', htmlString);
    this.liveDom.setHtml(htmlString);
    persistTab(this.id, 'AUDIO', htmlString);
  }

  getValue() {
    return getPersistedValue(this.id);
  }

  destroy() {
    this.liveDom.dispose();
    deleteById(this.id);
  }
}