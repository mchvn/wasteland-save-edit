  import { unformat } from './format'
  import lzf from 'lzfjs'

  /**
   * Deformats and recompresses data.
   * @param {string} data 
   */
  export const recompress = (data) => {
    const unformatted = unformat(data)
    console.log(unformatted)
    const newData = compress(unformatted)
    return { newData, dSize: unformatted.length, sdSize: newData.byteLength }
  }

    /**
   * Run the LZF compression algorithm to recompress the XML
   * @param {string} text 
   */
  const compress = (text) => {
    var data = new Buffer(text);
    return (lzf.compress(data));
  }
