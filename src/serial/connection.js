import { ReadlineParser } from "serialport";

export default class SerialConnection {
  constructor(path) {
    this.port = new SerialPort({
      path,
      baudRate: 9600,
    });
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
    this.listeners = [];

    this.parser.on("data", (data) => {
      this.listeners.forEach((listener) => listener(data));
    });
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}
