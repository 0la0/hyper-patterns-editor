import LiveDom from 'live-dom';
import EditorTab from './editor-tab';
import CodeMirrorWrapper from '../codemirror-wrapper';

export default class TabWindow {
  constructor(label, tabContainer, windowContainer) {
    this.tabContainer = tabContainer;
    this.windowContainer = windowContainer;

    this.liveDom = new LiveDom({ domNode: document.createElement('div') });
    const handleSubmit = val => this.liveDom.setHtml(val);
    document.body.appendChild(this.liveDom.domNode);

    this.tab = new EditorTab(label, this.handleTabClick.bind(this), this.handleTabRemove.bind(this));
    this.codemirrorWrapper = new CodeMirrorWrapper(handleSubmit);

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

  _removeSelf() {
    this.tabContainer.removeChild(this.tab);
    this.windowContainer.removeChild(this.codemirrorWrapper);
    // TODO: this.liveDom.destroy();
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
    this._removeSelf();
    this.onRemove(this);
  }
}
