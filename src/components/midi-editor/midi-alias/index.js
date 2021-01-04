import { midiDeviceAliases, } from 'hyper-patterns';
import BaseComponent from '../../primitives/util/base-component';
import style from './midi-alias.css';
import markup from './midi-alias.html';

export default class MidiAlias extends BaseComponent {
  static get tag() {
    return 'midi-alias';
  }

  constructor(aliasModel, onDelete) {
    super(style, markup, [ 'aliasName', 'deviceName', 'channel', 'note', 'value', 'duration' ]);
    this.aliasModel = aliasModel;
    this.onDelete = onDelete;
  }

  connectedCallback() {
    this.dom.aliasName.setAttribute('value', this.aliasModel.getAliasName());
    this.dom.deviceName.setAttribute('value', this.aliasModel.getDeviceName());
    this.dom.channel.setAttribute('value', this.aliasModel.getChannel().getValue());
    this.dom.note.setAttribute('value', this.aliasModel.getNote().getValue());
    this.dom.value.setAttribute('value', this.aliasModel.getValue().getValue());
    this.dom.duration.setAttribute('value', this.aliasModel.getDuration().getValue());
  }

  handleAliasNameChange(event) {
    const aliasName = event.target.value;
    const previousName = this.aliasModel.getAliasName();
    this.aliasModel.setAliasName(aliasName);
    midiDeviceAliases.deleteAlias(previousName);
    midiDeviceAliases.setAlias(aliasName, this.aliasModel);
  }

  handleDeviceNameChange(event) {
    const deviceName = event.target.value;
    this.aliasModel.setDeviceName(deviceName);
  }

  handleChannelChange(event) {
    const channel = parseInt(event.target.value, 10);
    this.aliasModel.setChannel(channel);
  }

  handleNoteChange(event) {
    const note = parseInt(event.target.value, 10);
    this.aliasModel.setNote(note);
  }

  handleValueChange(event) {
    const value = parseInt(event.target.value, 10);
    this.aliasModel.setValue(value);
  }

  handleDurationChange(event) {
    const duration = parseInt(event.target.value, 10);
    this.aliasModel.setDuration(duration);
  }
}
