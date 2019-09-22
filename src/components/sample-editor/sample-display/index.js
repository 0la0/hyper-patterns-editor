import BaseComponent from '../../primitives/util/base-component';
import PsSound from 'ps-sound';
import style from './sample-display.css';
import markup from './sample-display.html';

export default class SampleDisplay extends BaseComponent {
  static get tag() {
    return 'sample-display';
  }

  constructor(sampleName) {
    super(style, markup, [ 'label', 'editor' ]);
    this.sampleName = sampleName;
    this.editorIsActive = false;
    this.dom.label.textContent = sampleName;
  }

  playSample() {
    PsSound.previewSample(this.sampleName);
  }
}
