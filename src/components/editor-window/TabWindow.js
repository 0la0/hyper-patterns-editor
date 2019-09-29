import EditorTab from './editor-tab';
import CodeMirrorWrapper from '../codemirror-wrapper';

export default class TabWindow {
  constructor({ label, tabContainer, windowContainer, contentManager, onClick, onRemove }) {
    this.tabContainer = tabContainer;
    this.windowContainer = windowContainer;
    this.contentManager = contentManager;
    this.onClick = onClick;
    this.onRemove = onRemove;
    this.tab = new EditorTab(label, this.handleTabClick.bind(this), this.handleTabRemove.bind(this));
    this.codemirrorWrapper = new CodeMirrorWrapper(this.contentManager);
    this.tab.classList.add('tab');
    this.codemirrorWrapper.classList.add('editor');
    this.tabContainer.appendChild(this.tab);
    this.windowContainer.appendChild(this.codemirrorWrapper);
  }

  setActive(isActive) {
    this.tab.setActive(isActive);
    if (isActive) {
      this.codemirrorWrapper.focus();
      this.codemirrorWrapper.classList.add('editor-active');
    } else {
      this.codemirrorWrapper.classList.remove('editor-active');
    }
  }

  handleTabClick() {
    this.onClick(this);
  }

  handleTabRemove() {
    this.tabContainer.removeChild(this.tab);
    this.windowContainer.removeChild(this.codemirrorWrapper);
    this.contentManager.destroy();
    this.onRemove(this);
  }
}
