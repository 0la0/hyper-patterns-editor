import BaseComponent from '../../primitives/util/base-component';
import PsSound from 'ps-sound';
import style from './sample-display.css';
import markup from './sample-display.html';

export default class SampleDisplay extends BaseComponent {
  static get tag() {
    return 'sample-display';
  }

  constructor(sampleName, onDeleteCallback) {
    super(style, markup, [ 'sampleName' ]);
    this.sampleName = sampleName;
    this.onDeleteCallback = onDeleteCallback;
    this.dom.sampleName.setAttribute('value', sampleName);
  }

  playSample() {
    PsSound.previewSample(this.sampleName);
  }

  handleNameChange(event) {
    const newSampleName = event.target.value;
    PsSound.renameSample(this.sampleName, newSampleName);
    this.sampleName = newSampleName;
  }

  deleteSample() {
    PsSound.removeSample(this.sampleName);
    this.onDeleteCallback();
  }
}
