const STORAGE_KEY = 'HYPER_EDITOR_SCENE';

export function saveToLocalStorage(str = '') {
  localStorage.setItem(STORAGE_KEY, str);
}

export function openFromLocalStorage() {
  return localStorage.getItem(STORAGE_KEY);
}

export function saveToFile(str = '', fileName = 'hyper-patterns') {
  const formattedData = `data:application/json;charset=utf-8,${str}`;
  const ele = document.createElement('a');
  ele.setAttribute('href', formattedData);
  ele.setAttribute('download', fileName);
  ele.click();
}

export function openFilePicker(acceptedFileTypes, multiple = false) {
  return new Promise((resolve, reject) => {
    try {
      const inputElement = document.createElement('input');
      inputElement.setAttribute('type', 'file');
      inputElement.setAttribute('accept', acceptedFileTypes);
      inputElement.setAttribute('multiple', multiple);
      inputElement.style.setProperty('display', 'none');
      inputElement.addEventListener('change', () => resolve(inputElement.files));
      inputElement.click();
    } catch (error) {
      reject(error);
    }
  });
}
