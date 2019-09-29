import LiveDom from 'live-dom';
import { Observer, Subscription } from 'sea';
import dataStore  from '../Store';
import { eventBus } from '../EventBus';

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
    this.graphicsObserver = new Observer(this.handleDataStoreUpdate.bind(this));
    this.isConnected = true;
    this.clockIsRunning = false;
    this._start = () => {
      this.clockIsRunning = true;
      if (this.isConnected) {
        this.scene.start();
      }
    };
    this._stop = () => {
      this.clockIsRunning = false;
      this.scene.stop();
    };
    this.resizeSubscription = new Subscription('RESIZE', () => this.handleDataStoreUpdate(dataStore.graphics.value));
    document.addEventListener('CLOCK_START', this._start);
    document.addEventListener('CLOCK_STOP', this._stop);
    eventBus.subscribe(this.resizeSubscription);
    setTimeout(() => dataStore.graphics.observe(this.graphicsObserver));
  }

  setHtml(htmlString) {
    console.log('graphics window htmlString:', htmlString);
    this.liveDom.setHtml(htmlString);
  }

  destroy() {
    // TODO destroy liveDom
    dataStore.graphics.unobserve(this.graphicsObserver);
    document.removeEventListener('CLOCK_START', this._start);
    document.removeEventListener('CLOCK_STOP', this._stop);
    eventBus.unSubscribe(this.resizeSubscription);
  }

  handleDataStoreUpdate(graphicsState) {
    if (graphicsState.isOn) {
      if (!this.isConnected) {
        // TODO: if resume render loop
        this.parentElement.style.setProperty('display', 'block');
        this.isConnected = true;
      }
      const w = Math.round(graphicsState.width * window.innerWidth);
      const h = Math.round(graphicsState.height * window.innerHeight);
      requestAnimationFrame(() => {
        this.parentElement.style.setProperty('width', `${w}px`);
        this.parentElement.style.setProperty('height', `${h}px`);
        this.parentElement.style.setProperty('left', `${graphicsState.left * 100}%`);
        this.parentElement.style.setProperty('bottom', `${graphicsState.bottom * 100}%`);
        this.scene.setSize(w, h);
        if (this.clockIsRunning) {
          this.scene.start();
        }
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
