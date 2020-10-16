const lzf = require('lzfjs');
const {formatXml} = require('./format')
self.addEventListener('message', event => {
    const file = event.data
    const reader = new FileReader()

    reader.onload = async (e) => {
        const text = e.target.result
        const data = lzf.decompress(text).toString('utf8')

        postMessage({ fileName: file.name, xml: formatXml(data), dataSize: data.length, saveDataSize: text.byteLength })
    };
    reader.readAsArrayBuffer(file)
});