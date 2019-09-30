import store from '../Store';

export function persistTab(id, type, stringVal) {
  setTimeout(() => {
    store.tabs.setValue({
      [id]: {
        type,
        encodedValue: btoa(stringVal),
      },
    });
  });
}

export function getPersistedValue(id) {
  const tab = store.tabs.value[id];
    if (!tab) {
      return '';
    }
    try {
      return atob(tab.encodedValue);
    } catch(error) {
      console.error(error);
      return '';
    }
}

export function deleteById(id) {
  delete store.tabs.value[id];
}