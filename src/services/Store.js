import { Observable, ObservableObject } from 'sea';

class DataStore {
  constructor() {
    this.fontSize = new Observable(24);
    this.graphics = new ObservableObject({ isOn: false, width: 0, height: 0 });
    this.setting = new Observable('OFF');
  }
}
const dataStore = new DataStore();
export default dataStore;
