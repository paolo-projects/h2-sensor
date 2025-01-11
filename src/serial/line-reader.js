function uint8arrayToStringMethod(myUint8Arr) {
  return String.fromCharCode.apply(null, myUint8Arr);
}

export default class SerialPortLineReader {
  constructor(delimiter = "\r\n") {
    this.listeners = [];
    this.buffer = [];
    this.delimiter = delimiter;
  }

  checkBuffer() {
    const textDecoder = new TextDecoder("utf-8");

    for (let i = 0; i < this.buffer.length - this.delimiter.length + 1; i++) {
      const candidate = uint8arrayToStringMethod(
        this.buffer.slice(i, i + this.delimiter.length)
      );

      if (candidate == this.delimiter) {
        const line = uint8arrayToStringMethod(this.buffer.slice(0, i));
        this.buffer = this.buffer.slice(i + this.delimiter.length);
        this.listeners.forEach((listener) => listener(line));
        this.checkBuffer();
        break;
      }
    }
  }

  setReader(reader) {
    this.reader = reader;
  }

  clearBuffer() {
    this.buffer = [];
  }

  async read() {
    while (true) {
      const { value, done } = await this.reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        this.reader.releaseLock();
        break;
      }
      if (value) {
        this.buffer = this.buffer.concat(Array.from(value));
        this.checkBuffer();
      }
    }
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }
}
