import App from '../app';
import AppearanceEditor from '../appearance-editor';
import CodemirrorWrapper from '../codemirror-wrapper';
import EditorRoot from '../editor-root';
import EditorTab from '../editor-window/editor-tab';
import EditorWindow from '../editor-window';
import GraphicsWindowEditor from '../graphics-window-editor';
import MetronomeController from '../metronome-ctrl';
import MidiEditor from '../midi-editor';
import MidiDevice from '../midi-editor/midi-device';
import Primitives from '../primitives';
import SampleDisplay from '../sample-editor/sample-display';
import SampleEditor from '../sample-editor';
import SampleLoader from '../sample-editor/sample-loader';
import SampleVisualizer from '../sample-editor/sample-visualizer';
import SettingsEditor from '../settings-editor';

const components = [
  Primitives.TextButton,
  Primitives.ToggleButton,
  Primitives.ComboBox,
  Primitives.SliderHorizontal,
  Primitives.RouterOutlet,
  Primitives.TextInput,
  App,
  AppearanceEditor,
  CodemirrorWrapper,
  EditorRoot,
  EditorTab,
  EditorWindow,
  GraphicsWindowEditor,
  MetronomeController,
  MidiEditor,
  MidiDevice,
  SampleDisplay,
  SampleEditor,
  SampleLoader,
  SampleVisualizer,
  SettingsEditor,
];

export default function init() {
  components.forEach(component => customElements.define(component.tag, component));
}
