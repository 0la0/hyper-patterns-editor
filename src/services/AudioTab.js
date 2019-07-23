import LiveDom from 'live-dom';

export default class AudioTab {
  constructor() {
    this.liveDom = new LiveDom({ domNode: document.createElement('div') });
    document.body.appendChild(this.liveDom.domNode);
  }

  setHtml(htmlString) {
    console.log('htmlString:', htmlString);
    this.liveDom.setHtml(htmlString);
  }

  destroy() {
    // TODO
  }
}