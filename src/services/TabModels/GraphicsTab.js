import provideGraphicsWindow from './GraphicsWindow';
import { persistTab, getPersistedValue, deleteById } from './TabPersistence';

export default class GraphicsTab {
  constructor(id, defaultValue = '') {
    this.id = id;
    this.graphicsWindow = provideGraphicsWindow();
    this.graphicsWindow.addTab(this.id);
    if (defaultValue) {
      this.setHtml(defaultValue);
    }
  }

  setHtml(htmlString) {
    const subSceneString = `<ps-viz-sub-scene>${htmlString}</ps-viz-sub-scene>`;
    this.graphicsWindow.setTabHtml(this.id, subSceneString);
    persistTab(this.id, 'GRAPHICS', htmlString);
  }

  getValue() {
    return getPersistedValue(this.id);
  }

  destroy() {
    this.graphicsWindow.removeTab(this.id);
    deleteById(this.id);
  }
}