import App from '../app';
import AppearanceEditor from '../appearance-editor';
import CodemirrorWrapper from '../codemirror-wrapper';
import EditorRoot from '../editor-root';
import EditorTab from '../editor-window/editor-tab';
import EditorWindow from '../editor-window';
import DefautSamples from '../sample-manager/default-samples';
import GraphicsWindowEditor from '../graphics-window-editor';
import MetronomeController from '../metronome-ctrl';
import MidiAlias from '../midi-editor/midi-alias';
import MidiAliasList from '../midi-editor/midi-alias-list';
import MidiEditor from '../midi-editor';
import MidiDevice from '../midi-editor/midi-device';
import Primitives from '../primitives';
import SampleDisplay from '../sample-manager/sample-display';
import SampleEditor from '../sample-manager/sample-editor';
import SceneEditor from '../scene-editor';
import SettingsEditor from '../settings-editor';

const components = [
  Primitives.TextButton,
  Primitives.ToggleButton,
  Primitives.ComboBox,
  Primitives.ExpandableSection,
  Primitives.SliderHorizontal,
  Primitives.RouterOutlet,
  Primitives.TextInput,
  Primitives.ToastNotifcation,
  App,
  AppearanceEditor,
  CodemirrorWrapper,
  EditorRoot,
  EditorTab,
  EditorWindow,
  DefautSamples,
  GraphicsWindowEditor,
  MetronomeController,
  MidiAlias,
  MidiAliasList,
  MidiEditor,
  MidiDevice,
  SampleDisplay,
  SampleEditor,
  SceneEditor,
  SettingsEditor,
];

export default function init() {
  components.forEach(component => customElements.define(component.tag, component));
}
