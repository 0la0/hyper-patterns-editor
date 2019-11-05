
export function saveToFile(str = '', fileName = 'hyper-patterns') {
  const formattedData = `data:application/json;charset=utf-8,${str}`;
  const ele = document.createElement('a');
  ele.setAttribute('href', formattedData);
  ele.setAttribute('download', fileName);
  ele.click();
}

export function openFromFile() {
  console.log('TODO: open from file, combine with FileLoader.js');
}
