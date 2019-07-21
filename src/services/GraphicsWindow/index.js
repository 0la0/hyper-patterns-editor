import LiveDom from 'live-dom';

function buildSceneComponent() {
  const scene = document.createElement('ps-viz-scene');
  scene.setAttribute('embed', '');
  scene.style.setProperty('height', '100%');
  scene.style.setProperty('width', '100%');
  scene.style.setProperty('display', 'block');
  return scene;
}

const evalWrapperFn = htmlString => `<ps-viz-scene embed>${htmlString}</ps-viz-scene>`;

export default class GraphicsWindowProvider {
  constructor() {
    const parentElement = document.getElementById('graphicsWindow');
    this.scene = buildSceneComponent();
    this.liveDom = new LiveDom({ domNode: this.scene, evalWrapperFn });
    parentElement.appendChild(this.scene);
  }

  setHtml(htmlString) {
    console.log('htmlString:', htmlString);
    this.liveDom.setHtml(htmlString);
  }
}
