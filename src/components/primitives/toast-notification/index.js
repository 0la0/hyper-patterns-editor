import BaseComponent from '../util/base-component';
import style from './toast-notification.css';
import markup from './toast-notification.html';

const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
const CONTAINER_VISIBLE = 'container-visible';
const VISIBLE_TIME = 2500;

export default class ToastNotification extends BaseComponent {
  static get tag() {
    return 'toast-notification';
  }

  constructor() {
    super(style, markup, ['container', 'label']);
    this.isShowing = false;
    this.onClick = () => requestAnimationFrame(
      () => this.dom.container.classList.remove(CONTAINER_VISIBLE)
    );
    this.handleMessage = event => {
      requestAnimationFrame(() => {
        this.dom.label.innerText = event.detail.message;
        this.dom.container.classList.add(CONTAINER_VISIBLE);
        if (!event.detail.holdOpen) {
          setTimeout(this.onClick, VISIBLE_TIME);
        }
      });
    };
  }

  connectedCallback() {
    this.dom.container.addEventListener('click', this.onClick);
    document.addEventListener(SHOW_NOTIFICATION, this.handleMessage);
  }

  disconnectedCallback() {
    this.dom.container.removeEventListener('click', this.onClick);
    document.removeEventListener(SHOW_NOTIFICATION, this.handleMessage);
  }
}
