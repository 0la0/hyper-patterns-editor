import 'ps-markup';
import init from './components/app/componentManager';
import App from './components/app';

document.addEventListener('DOMContentLoaded', () => {
  init();
  document.body.appendChild(new App());
});
