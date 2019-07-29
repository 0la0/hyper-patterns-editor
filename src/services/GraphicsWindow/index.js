import LiveDom from 'live-dom';
import Subscription from '../EventBus/Subscription';
import { eventBus, } from '../EventBus';

// TODO: create <ps-viz-global-scene> that acts as a singleton
function buildSceneComponent() {
  const scene = document.createElement('ps-viz-scene');
  scene.setAttribute('embed', '');
  scene.style.setProperty('height', '100%');
  scene.style.setProperty('width', '100%');
  scene.style.setProperty('display', 'block');
  return scene;
}

const evalWrapperFn = htmlString => `<ps-viz-scene embed>${htmlString}</ps-viz-scene>`;

class GraphicsWindow {
  constructor() {
    this.parentElement = document.getElementById('graphicsWindow');
    this.scene = buildSceneComponent();
    this.liveDom = new LiveDom({ domNode: this.scene, evalWrapperFn });
    this.parentElement.appendChild(this.scene);
    this.eventBusSubscription = new Subscription('DATA_STORE', this.handleDataStoreUpdate.bind(this));
    eventBus.subscribe(this.eventBusSubscription);
    this.isConnected = true;
    // TODO: store isRunning variable, use it to start / stop render loop
    document.addEventListener('metronometoggle', event => {
      if (event.detail.isOn && this.isConnected) {
        this.scene.start();
      } else {
        this.scene.stop();
      }
    });
  }

  setHtml(htmlString) {
    console.log('graphics window htmlString:', htmlString);
    this.liveDom.setHtml(htmlString);
  }

  destroy() {
    // TODO destroy liveDom
    this.eventBusSubscription.unsubscribe(this.eventBusSubscription);
  }

  handleDataStoreUpdate({ dataStore }) {
    if (dataStore.graphicsAreOn) {
      if (!this.isConnected) {
        // TODO: if resume render loop
        this.parentElement.style.setProperty('display', 'block');
        this.isConnected = true;
      }
      const w = Math.round(dataStore.graphicsWindowWidth * window.innerWidth);
      const h = Math.round(dataStore.graphicsWindowHeight * window.innerHeight);
      requestAnimationFrame(() => {
        this.parentElement.style.setProperty('width', `${w}px`);
        this.parentElement.style.setProperty('height', `${h}px`);
        this.scene.setSize(w, h);
      });
    } else {
      if (this.isConnected) {
        // TODO: suspend render loop
        this.parentElement.style.setProperty('display', 'none');
        this.isConnected = false;
      }
    }
  }
}

let instance;
export default function provideGraphicsWindow() {
  if (!instance) {
    instance = new GraphicsWindow();
  }
  return instance;
}
