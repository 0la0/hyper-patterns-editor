import BaseComponent from '../primitives/util/base-component';
import { clamp } from '../../services/Math';
import dataStore  from '../../services/Store';
import style from './graphics-window-editor.css';
import markup from './graphics-window-editor.html';

const props = {
  width: 25,
  height: 25,
  bottom: 0,
  left: 0,
};

export default class GraphicsWindowEditor extends BaseComponent {
  static get tag() {
    return 'graphics-window-editor';
  }

  constructor() {
    super(style, markup, [ 'resizableContainer', 'resizableRect' ]);
    this.state = {
      draggingStrategy: null,
      left: 0,
      bottom: 0,
      width: 0.5,
      height: 0.5,
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
        console.log('resizeREct', this.state.bufferX, -this.state.bufferY)
      },
    };
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
      const { clientX, clientY } = event;
      const targetRect = event.target.getBoundingClientRect();
      this.state.bufferX = Math.round(clientX - targetRect.left);
      this.state.bufferY = Math.round(targetRect.top - clientY);
    });
    document.addEventListener('mouseup', () => this.state.draggingStrategy = null);
    document.addEventListener('mousemove', this.mouseMoveListener);
  }

  disconnectedCallback() {
    // TODO: remove listeners
  }
}
