import { Observer } from 'sea';
import BaseComponent from '../primitives/util/base-component';
import { clamp } from '../../services/Math';
import dataStore  from '../../services/Store';
import style from './graphics-window-editor.css';
import markup from './graphics-window-editor.html';

export default class GraphicsWindowEditor extends BaseComponent {
  static get tag() {
    return 'graphics-window-editor';
  }

  constructor() {
    super(style, markup, [ 'graphicsSettings', 'resizableContainer', 'resizableRect', 'resizableCtrlNE' ]);
    this.state = {
      draggingStrategy: null,
      left: 0,
      bottom: 0,
      lastX: 0,
      lastY: 0
    };
    this.dragStrategy = {
      resizableCtrlNE: (event) => {
        const normalX = (event.clientX - this.boundingRect.left + this.state.bufferX) / this.boundingRect.width;
        const normalY = (event.clientY - this.boundingRect.top + this.state.bufferY) / this.boundingRect.height;
        const x = clamp(normalX, 0, 1);
        const y = 1 - clamp(normalY, 0, 1);
        dataStore.graphics.setValue({ width: x, height: y });
        requestAnimationFrame(() => {
          this.dom.resizableRect.style.setProperty('width', `${x * 100}%`);
          this.dom.resizableRect.style.setProperty('height', `${y * 100}%`);
        });
      },
      resizableRect: (event) => {
        const targetRect = this.dom.resizableRect.getBoundingClientRect();
        const diffX = event.screenX - this.state.lastX;
        const diffY = event.screenY - this.state.lastY;

        const skipX = diffX === 0
          || targetRect.right > this.boundingRect.right && diffX > 0
          || targetRect.left < this.boundingRect.left && diffX < 0;

        const skipY = diffY === 0
          || targetRect.bottom > this.boundingRect.bottom && diffY > 0
          || targetRect.top < this.boundingRect.top && diffY < 0;

        if (!skipX) {
          this.state.left = this.state.left + diffX;
          this.dom.resizableRect.style.setProperty('left', `${this.state.left}px`);
        }
        if (!skipY) {
          this.state.bottom = this.state.bottom - diffY;
          this.dom.resizableRect.style.setProperty('bottom', `${this.state.bottom}px`);
        }
        if (!skipX || !skipY) {
          const left = (targetRect.left - this.boundingRect.left) / this.boundingRect.width;
          const bottom = (this.boundingRect.bottom - targetRect.bottom) / this.boundingRect.height;
          dataStore.graphics.setValue({ left, bottom });
        }
        this.state.lastX = event.screenX;
        this.state.lastY = event.screenY;
      },
    };

    this.graphicsObserver = new Observer(this.handleDataStoreUpdate.bind(this));
    dataStore.graphics.observe(this.graphicsObserver);
  }

  connectedCallback() {
    this.mouseMoveListener = event => {
      if (!this.state.draggingStrategy) {
        return;
      }
      this.state.draggingStrategy(event);
    };
    
    this.dom.resizableRect.addEventListener('mousedown', event => {
      this.state.draggingStrategy = this.dragStrategy[event.target.id];
      this.boundingRect = this.dom.resizableContainer.getBoundingClientRect();
      
      this.resizeableRect = this.dom.resizableRect.getBoundingClientRect();
      const targetRect = event.target.getBoundingClientRect();

      const diffX = this.resizeableRect.left - this.boundingRect.left;
      const diffY = this.resizeableRect.bottom - this.boundingRect.bottom;

      this.state.bufferX = event.clientX - targetRect.left - diffX;
      this.state.bufferY = targetRect.top - event.clientY - diffY;
      
      this.state.lastX = event.screenX;
      this.state.lastY = event.screenY;
    });
    document.addEventListener('mouseup', () => this.state.draggingStrategy = null);
    document.addEventListener('mousemove', this.mouseMoveListener);
  }

  disconnectedCallback() {
    // TODO: remove listeners
    dataStore.graphics.unobserve(this.graphicsObserver);
  }

  handleGraphicsToggle(event) {
    dataStore.graphics.setValue({ isOn: event.target.value });
  }

  handleDataStoreUpdate(graphicsState) {
    requestAnimationFrame(() => {
      if (graphicsState.isOn) {
        this.dom.graphicsSettings.classList.add('graphics-settings-active');
      } else {
        this.dom.graphicsSettings.classList.remove('graphics-settings-active');
      }
    });
  }

  handleFullscreen() {
    dataStore.graphics.setValue({
      width: 1,
      height: 1,
      left: 0,
      bottom: 0
    });
    requestAnimationFrame(() => {
      this.dom.resizableRect.style.setProperty('width', '100%');
      this.dom.resizableRect.style.setProperty('height', '100%');
      this.dom.resizableRect.style.setProperty('left', '0px');
      this.dom.resizableRect.style.setProperty('bottom', '0px');
    });
  }
}
