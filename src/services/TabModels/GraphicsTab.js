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
    const subSceneString = `<h-viz-sub-scene>${htmlString}</h-viz-sub-scene>`;
    const result = this.graphicsWindow.setTabHtml(this.id, subSceneString);
    persistTab(this.id, 'GRAPHICS', htmlString);
    return result;
  }

  getValue() {
    return getPersistedValue(this.id);
  }

  destroy() {
    this.graphicsWindow.removeTab(this.id);
    deleteById(this.id);
  }
}