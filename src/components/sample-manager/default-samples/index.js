import HyperSound from 'hyper-sound';
import BaseComponent from '../../primitives/util/base-component';
import SampleDisplay from '../sample-display';
import style from '../sample-editor/sample-editor.css';
import markup from './default-samples.html';

export default class DefaultSamples extends BaseComponent {
  static get tag() {
    return 'default-samples';
  }

  constructor() {
    super(style, markup, [ 'sampleList' ]);
    this._populateSampleKeys();
  }

  _populateSampleKeys() {
    requestAnimationFrame(() => {
      const sampleKeys = HyperSound.getDefaultSampleNames();
      [ ...this.dom.sampleList.children ].forEach(ele => this.dom.sampleList.removeChild(ele));
      sampleKeys.forEach(sampleName =>
        this.dom.sampleList.appendChild(new SampleDisplay({ sampleName, })));
    });
  }
}
