import provideGraphicsWindow from './GraphicsWindow';
import { persistTab, getPersistedValue } from './TabPersistence';

export default class GraphicsTab {
  constructor(id) {
    this.id = id;
    this.graphicsWindow = provideGraphicsWindow();
  }

  setHtml(htmlString) {
    console.log('htmlString:', htmlString);
    this.graphicsWindow.setHtml(htmlString);
    persistTab(this.id, 'GRAPHICS', htmlString);
  }

  getValue() {
    return getPersistedValue(this.id);
  }

  destroy() {
    console.log('TODO: graphicsTab.destroy');
  }
}