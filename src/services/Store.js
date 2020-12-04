import { Observable, ObservableObject } from 'sea';
import HyperSound from 'hyper-sound';

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const byteArray = [...binaryString]
    .map(char => char.charCodeAt(0));
  const typedByteArray = Uint8Array.from(byteArray);
  return typedByteArray.buffer;
}

function arrayBufferToBase64(arrayBuffer) {
  const byteArray = Array.from(new Uint8Array(arrayBuffer));
  const binaryString = byteArray
    .map(byte => String.fromCharCode(byte))
    .join('');
  return window.btoa(binaryString);
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
    const persistableMap = persistableProperties
      .reduce((acc, key) => Object.assign(acc, { [key]: this[key].value } ), {});
    persistableMap.samples = serialzedSampleMap;
    return encodeURIComponent(JSON.stringify(persistableMap));
  }

  hydrate(serializedString = '') {
    try {
      const data = JSON.parse(decodeURIComponent(serializedString));
      persistableProperties
        .filter(key => this[key] && data[key] !== undefined)
        .forEach(key => this[key].setValue(data[key]));
      if (data.samples && Object.keys(data.samples).length) {
        return Promise.all(
          Object.keys(data.samples).map(sampleKey => {
            console.log('deserialize sample', sampleKey);
            const sampleBase64 = data.samples[sampleKey];
            const sampleArrayBuffer = base64ToArrayBuffer(sampleBase64);
            return HyperSound.addSample(sampleKey, sampleArrayBuffer);
          }));
      } else {
        return Promise.resolve();
      }
    } catch(error) {
      console.log('Deserialize error', error);
    }
  }
}

const dataStore = new DataStore();
export default dataStore;
