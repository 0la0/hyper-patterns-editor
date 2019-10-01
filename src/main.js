import 'ps-pattern';
import 'ps-sound';
import 'ps-visuals';

import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/show-hint';

import init from './components/app/componentManager';
import App from './components/app';
import { initGraphicsWindow } from './services/TabModels/GraphicsWindow';

document.addEventListener('DOMContentLoaded', () => {
  init();
  document.body.appendChild(new App());
  initGraphicsWindow();
});
