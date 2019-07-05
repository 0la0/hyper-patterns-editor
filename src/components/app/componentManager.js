import App from '../app';
import CodemirrorWrapper from '../codemirror-wrapper';
import EditorRoot from '../editor-root';
import Primitives from '../primitives';

const components = [
  Primitives.TextButton,
  Primitives.ToggleButton,
  Primitives.ComboBox,
  Primitives.SliderHorizontal,
  Primitives.RouterOutlet,
  Primitives.TextInput,
  App,
  CodemirrorWrapper,
  EditorRoot
];

export default function init() {
  components.forEach(component => customElements.define(component.tag, component));
}
