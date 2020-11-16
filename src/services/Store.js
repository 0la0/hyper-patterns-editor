import { Observable, ObservableObject } from 'sea';

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
    const test = persistableProperties
      .reduce((acc, key) => Object.assign(acc, { [key]: this[key].value } ), {});
    return encodeURIComponent(JSON.stringify(test));
  }

  hydrate(serializedString = '') {
    try {
      const data = JSON.parse(decodeURIComponent(serializedString));
      persistableProperties
        .filter(key => this[key] && data[key] !== undefined)
        .forEach(key => this[key].setValue(data[key]));
    } catch(error) {
      console.log('Deserialize error', error);
    }
  }
}

const dataStore = new DataStore();
export default dataStore;
