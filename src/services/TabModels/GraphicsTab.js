import provideGraphicsWindow from './GraphicsWindow';
import { persistTab, getPersistedValue } from './TabPersistence';

export default class GraphicsTab {
  constructor(id) {
    this.id = id;
    this.graphicsWindow = provideGraphicsWindow();
    this.graphicsWindow.addTab(this.id);
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
  }
}