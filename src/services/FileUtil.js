import { openFilePicker } from './FileStorage';

export function getJsonFromFile(file) {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', event => resolve(event.target.result));
      fileReader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
}

function getArrayBufferFromFile(file) {
  const name = file.name.substring(0, file.name.lastIndexOf('.'));
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', event => resolve({ name, arrayBuffer: event.target.result }));
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
}

export function openFilesAsAudioBuffers() {
  return openFilePicker('audio/*')
    .then(files => Promise.all([ ...files ].map(file => getArrayBufferFromFile(file))));
}
