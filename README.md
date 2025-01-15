# Sensor Reader

It's a fully cross-platform electron application made to interface with a USB serial peripheral and read a measurement value from it. It relies on the browser built in [SerialPort API](https://developer.mozilla.org/en-US/docs/Web/API/SerialPort), and Vue3 for the UI.

For now the value decoding is hardcoded, but in the future it should be possible to configure a RegExp to parse the value. The protocol will probably still rely on newline terminators (\r\n).
