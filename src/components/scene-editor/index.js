import { Observer } from 'sea';
import BaseComponent from '../primitives/util/base-component';
import dataStore from '../../services/Store';
import style from './scene-editor.css';
import markup from './scene-editor.html';

export default class SceneEditor extends BaseComponent {
  static get tag() {
    return 'scene-editor';
  }

  constructor() {
    super(style, markup, [ 'sceneName' ]);
    this.dom.sceneName.setAttribute('value', 'test');
    this.projectSettingsObserver = new Observer(({ name, }) =>
      this.dom.sceneName.setAttribute('value', name));
  }

  connectedCallback() {
    dataStore.projectSettings.observe(this.projectSettingsObserver);
  }

  disconnectedCallback() {
    dataStore.projectSettings.removeObserver(this.projectSettingsObserver);
  }

  handleNameChange(event) {
    console.log('scene name change', event.target.value);
    // TODO: save to store
    dataStore.projectSettings.setValue({ name: event.target.value });
  }

  saveToLocalStorage() {
    dataStore.saveToLocalStorage();
  }

  openFromLocalStorage() {
    dataStore.openFromLocalStorage();
    document.dispatchEvent(new CustomEvent('SESSION_OPEN'));
  }
}
