import { MidiAliasModel, midiDeviceAliases, } from 'hyper-patterns';
import BaseComponent from '../../primitives/util/base-component';
import MidiAlias from '../midi-alias/index.js';
import style from './midi-alias-list.css';
import markup from './midi-alias-list.html';

export default class MidiAliasList extends BaseComponent {
  static get tag() {
    return 'midi-alias-list';
  }

  constructor() {
    super(style, markup, [ 'aliascontainer' ]);
    this.onSessionOpen = () => midiDeviceAliases.getAllNames()
      .map(aliasName => midiDeviceAliases.getAlias(aliasName))
      .filter(Boolean)
      .forEach(aliasModel => this._addAlias(aliasModel));
  }

  connectedCallback() {
    document.addEventListener('SESSION_OPEN', this.onSessionOpen);
  }

  disconnectedCallback() {
    document.removeEventListener('SESSION_OPEN', this.onSessionOpen);
  }

  _addAlias(aliasModel) {
    const aliasComponent = new MidiAlias(aliasModel, () => {
      this.dom.aliascontainer.removeChild(aliasComponent);
      midiDeviceAliases.deleteAlias(aliasModel.getAliasName());
    });
    this.dom.aliascontainer.appendChild(aliasComponent);
  }

  addAlias() {
    this._addAlias(new MidiAliasModel());
  }
}
