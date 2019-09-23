import { Observable, ObservableObject } from 'sea';

const persistableProperties = [ 'fontSize', 'graphics' ];
const storageKey = 'SCENE';

class DataStore {
  constructor() {
    this.fontSize = new Observable(24);
    this.graphics = new ObservableObject({ isOn: false, width: 0.5, height: 0.5, left: 0, bottom: 0 });
    this.setting = new Observable('OFF');
  }

  _serialize() {
    return persistableProperties
      .reduce((acc, key) => Object.assign(acc, { [key]: this[key].value } ), {});
  }

  _deserialize(serializedString) {
    try {
      const data = JSON.parse(serializedString);
      persistableProperties
        .filter(key => this[key])
        .forEach(key => this[key].setValue(data[key]));
    } catch(error) {
      console.log('Deserialize error', error);
    }
  }

  saveToLocalStorage() {
    const serialized = JSON.stringify(this._serialize());
    localStorage.setItem(storageKey, serialized);
  }

  openFromLocalStorage() {
    const storedItem = localStorage.getItem(storageKey);
    if (!storedItem) {
      console.log('Scene not found in local storage');
      return;
    }
    this._deserialize(storedItem);
  }
}

const dataStore = new DataStore();
export default dataStore;
