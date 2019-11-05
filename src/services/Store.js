import { ObservableObject } from 'sea';
import { saveToFile, openFromFile } from './FileSaver';

const persistableProperties = [ 'graphics', 'tabs', 'projectSettings' ];
const storageKey = 'SCENE';

class DataStore {
  constructor() {
    this.graphics = new ObservableObject({ isOn: false, width: 0.5, height: 0.5, left: 0, bottom: 0 });
    this.tabs = new ObservableObject({});
    this.projectSettings = new ObservableObject({
      name: 'hyper-project',
      fontSize: 24,
    });
  }

  _serialize() {
    const test = persistableProperties
      .reduce((acc, key) => Object.assign(acc, { [key]: this[key].value } ), {});
    return encodeURIComponent(JSON.stringify(test));
  }

  _deserialize(serializedString) {
    try {
      const data = JSON.parse(decodeURIComponent(serializedString));
      persistableProperties
        .filter(key => this[key])
        .forEach(key => this[key].setValue(data[key]));
    } catch(error) {
      console.log('Deserialize error', error);
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(storageKey, this._serialize());
  }

  openFromLocalStorage() {
    const storedItem = localStorage.getItem(storageKey);
    if (!storedItem) {
      console.log('Scene not found in local storage');
      return;
    }
    this._deserialize(storedItem);
  }

  saveToFile() {
    const serialized = this._serialize();
    saveToFile(serialized, 'TEST.json');
  }

  openFromFile() {
    openFromFile();
  }
}

const dataStore = new DataStore();
export default dataStore;
