import { Observable, ObservableObject } from 'sea';
import HyperSound from 'hyper-sound';

function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64( buffer ) {
  let binary = '';
  let bytes = new Uint8Array( buffer );
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[ i ]);
  }
  return window.btoa( binary );
}


function getSerializedSampleMap() {
  return HyperSound.getSampleNames().reduce((acc, sampleKey) => { 
    const sampleArrayBuffer = HyperSound.getSampleArrayBuffer(sampleKey);
    const sampleBase64 = arrayBufferToBase64(sampleArrayBuffer);
    return Object.assign(acc, { [sampleKey]: sampleBase64, });
  }, {});
}

const persistableProperties = [ 'bpm', 'graphics', 'tabs', 'projectSettings' ];

class DataStore {
  constructor() {
    this.bpm = new Observable(120);
    this.graphics = new ObservableObject({ isOn: false, width: 0.5, height: 0.5, left: 0, bottom: 0 });
    this.tabs = new ObservableObject({});
    this.projectSettings = new ObservableObject({
      name: 'hyper-project',
      fontSize: 24,
    });
  }

  getSerializedString() {
    const serialzedSampleMap = getSerializedSampleMap();
    // TODO: rename from "test"
    const test = persistableProperties
      .reduce((acc, key) => Object.assign(acc, { [key]: this[key].value } ), {});
    test.samples = serialzedSampleMap;
    return encodeURIComponent(JSON.stringify(test));
  }

  hydrate(serializedString = '') {
    try {
      const data = JSON.parse(decodeURIComponent(serializedString));
      persistableProperties
        .filter(key => this[key] && data[key] !== undefined)
        .forEach(key => this[key].setValue(data[key]));
      if (data.samples && Object.keys(data.samples).length) {
        Object.keys(data.samples).forEach(sampleKey => {
          const sampleBase64 = data.samples[sampleKey];
          const sampleArrayBuffer = base64ToArrayBuffer(sampleBase64);
          HyperSound.addSample(sampleKey, sampleArrayBuffer);
        });
        document.dispatchEvent(new CustomEvent('REFRESH_SAMPLES'));
      }
    } catch(error) {
      console.log('Deserialize error', error);
    }
  }
}

const dataStore = new DataStore();
export default dataStore;
