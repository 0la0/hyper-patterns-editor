import HyperSound from 'hyper-sound';
import BaseComponent from '../../primitives/util/base-component';
import SampleDisplay from '../sample-display';
import { openFilesAsAudioBuffers } from '../../../services/FileUtil';
import style from './sample-editor.css';
import markup from './sample-editor.html';

export default class SampleEditor extends BaseComponent {
  static get tag() {
    return 'sample-editor';
  }

  constructor(closeCallback) {
    super(style, markup, [ 'sampleList' ]);
    this.handleClose = closeCallback;
    this._populateSampleKeys();
    this.refreshSamples = this._populateSampleKeys.bind(this);
  }

  connectedCallback() {
    document.addEventListener('SESSION_OPEN', this.refreshSamples);
  }

  disconnectedCallback() {
    document.removeEventListener('SESSION_OPEN', this.refreshSamples);
  }

  _populateSampleKeys() {
    requestAnimationFrame(() => {
      const sampleKeys = HyperSound.getSampleNames();
      [ ...this.dom.sampleList.children ].forEach(ele => this.dom.sampleList.removeChild(ele));
      sampleKeys.forEach(sampleName =>
        this.dom.sampleList.appendChild(new SampleDisplay({ sampleName, onDeleteCallback: this._populateSampleKeys.bind(this), })));
    });
  }

  loadSample() {
    openFilesAsAudioBuffers()
      .then((nameArrayBufferPairs) => Promise.all(
        nameArrayBufferPairs.map(({ name, arrayBuffer }) => HyperSound.addSample(name, arrayBuffer))
      ))
      .then(() => this._populateSampleKeys())
      .catch(error => console.log('loadSample error', error));
  }
}
