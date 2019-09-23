import BaseComponent from '../primitives/util/base-component';
import store from '../../services/Store';
import style from './scene-editor.css';
import markup from './scene-editor.html';

export default class SceneEditor extends BaseComponent {
  static get tag() {
    return 'scene-editor';
  }

  constructor() {
    super(style, markup, [ 'sceneName' ]);
    this.dom.sceneName.setAttribute('value', 'test');
  }

  handleNameChange(event) {
    console.log('scene name change', event.target.value);
  }

  saveToLocalStorage() {
    store.saveToLocalStorage();
  }

  openFromLocalStorage() {
    store.openFromLocalStorage();
  }
}
