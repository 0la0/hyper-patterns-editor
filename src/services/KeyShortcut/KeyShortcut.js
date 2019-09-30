export default class KeyShortcut {
  constructor({
    keyCode,
    ctrlKey = false,
    shiftKey = false,
    address,
  }) {
    this.keyCode = keyCode;
    this.ctrlKey = ctrlKey;
    this.shiftKey = shiftKey;
    this.address = address;
  }

  matchesKeyEvent(keyEvent) {
    return keyEvent.code === this.keyCode
      && keyEvent.ctrlKey === this.ctrlKey
      && keyEvent.shiftKey === this.shiftKey;
  }
}
