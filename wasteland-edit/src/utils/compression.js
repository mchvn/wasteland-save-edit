import lzf from 'lzfjs';

/** 
* Compress text using lzf
* @param {string} text to compress
* @returns {Buffer} compressed text
*/
export const compress = (text) => {
    var data = new Buffer(text);
    return (lzf.compress(data));
}


export const decompress = (file, callback) => {
    const myWorker = new Worker('./decompressionWorker.js')
    myWorker.postMessage([file]);

    myWorker.onmessage = function(e) {
        console.log(e)
        callback(e.data);
      }
}

