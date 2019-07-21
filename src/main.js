import 'ps-markup';
import 'ps-viz-markup';

import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/show-hint';

import init from './components/app/componentManager';
import App from './components/app';

document.addEventListener('DOMContentLoaded', () => {
  init();
  document.body.appendChild(new App());
});
