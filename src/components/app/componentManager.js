import App from '../app';
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
  EditorRoot
];

components.forEach(component => customElements.define(component.tag, component));
