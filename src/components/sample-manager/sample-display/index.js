import BaseComponent from '../../primitives/util/base-component';
import HyperSound from 'hyper-sound';
import style from './sample-display.css';
import markup from './sample-display.html';

export default class SampleDisplay extends BaseComponent {
  static get tag() {
    return 'sample-display';
  }

  constructor({ sampleName = '', onDeleteCallback, }) {
    super(style, markup, [ 'deletableSection', 'sampleName' ]);
    this.sampleName = sampleName;
    this.onDeleteCallback = onDeleteCallback;
    this.dom.sampleName.setAttribute('value', sampleName);
    if (!onDeleteCallback) {
      this.dom.deletableSection.classList.add('deletable-suppressed');
    }
  }

  playSample() {
    HyperSound.previewSample(this.sampleName);
  }

  handleNameChange(event) {
    const newSampleName = event.target.value;
    HyperSound.renameSample(this.sampleName, newSampleName);
    this.sampleName = newSampleName;
  }

  deleteSample() {
    HyperSound.removeSample(this.sampleName);
    this.onDeleteCallback();
  }
}
