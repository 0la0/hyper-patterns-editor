import EditorTab from './editor-tab';
import CodeMirrorWrapper from '../codemirror-wrapper';
import { audioMock, graphicsMock } from './TabMockContent';

export default class TabWindow {
  constructor(label, tabContainer, windowContainer, contentManager) {
    this.tabContainer = tabContainer;
    this.windowContainer = windowContainer;
    this.contentManager = contentManager;
    this.tab = new EditorTab(label, this.handleTabClick.bind(this), this.handleTabRemove.bind(this));
    const mockContent = contentManager.constructor.name === 'AudioTab' ? audioMock : graphicsMock;
    this.codemirrorWrapper = new CodeMirrorWrapper(this.contentManager.setHtml.bind(this.contentManager), mockContent);
    this.tab.classList.add('tab');
    this.codemirrorWrapper.classList.add('editor');
    this.tabContainer.appendChild(this.tab);
    this.windowContainer.appendChild(this.codemirrorWrapper);
  }

  setActive(isActive) {
    this.tab.setActive(isActive);
    isActive ?
      this.codemirrorWrapper.classList.add('editor-active') :
      this.codemirrorWrapper.classList.remove('editor-active');
  }

  setHandleClick(onClick) {
    this.onClick = onClick;
    return this;
  }

  handleTabClick() {
    this.onClick(this);
  }

  setHandleRemove(onRemove) {
    this.onRemove = onRemove;
    return this;
  }

  handleTabRemove() {
    this.tabContainer.removeChild(this.tab);
    this.windowContainer.removeChild(this.codemirrorWrapper);
    this.contentManager.destroy();
    this.onRemove(this);
  }
}
