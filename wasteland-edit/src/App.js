import React, { useState, useEffect } from 'react';
import './App.css';
import AceEditor from "react-ace";
import { unformat } from './utils/format'
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-monokai";
import styled from '@emotion/styled'
import 'brace/ext/searchbox'
import FileSelector from './components/FileSelector'
import DecompressionWorker from './utils/decompression.worker.js';
import lzf from 'lzfjs';

const Button = styled.button`
  padding: 10px;
  background-color: #444;
  cursor: pointer;
  margin: 10px;
  border: 0px solid;
  font-size: 12;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  &:hover {
    color: black;
  }
`


function App() {

  const [xml, setXml] = useState("<empty/>");
  const [dataSize, setDataSize] = useState(0); //decompressed, should be bigger
  const [saveDataSize, setSaveDataSize] = useState(0); //compressed, should be smaller
  const [fileName, setFileName] = useState(''); //compressed, should be smaller

  //create a worker so that the decompression doesn't lock the UI
  const worker = new DecompressionWorker();
  worker.onmessage = (e) => {
    const { fileName, xml, dataSize, saveDataSize } = e.data
    setXml((xml))
    setDataSize(dataSize)
    setSaveDataSize(saveDataSize)
    setFileName(fileName)
  }


  /**
   * Deformats and recompresses data.
   * @param {string} data 
   */
  const recompress = (data) => {
    const unformatted = unformat(data)
    const newData = compress(unformatted)
    return { newData, dSize: unformatted.length, sdSize: newData.byteLength }
  }

  /**
   * Create a file and download it (a bit workaroundy, but it works)
   */
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const { newData, dSize, sdSize } = recompress(xml)
    console.log(dSize, sdSize)
    const file = new Blob([newData], { type: 'text/plain' });
    setDataSize(dSize)
    setSaveDataSize(sdSize)
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  }


  const compress = (text) => {
    var data = new Buffer(text);
    return (lzf.compress(data));
  }

  /**
   * Displays file in editor
   * @param {Blob[]} files 
   */

  const showFile = async (files) => {
    worker.postMessage(files[0])  //just take the first file if mulitple are uploaded... in the future maybe show an error
  }



  return (
    <div className="App" style={{ margin: 0 }}>
      <div style={{ margin: '10px' }}>
        <h1>Wasteland 3 Save Editor</h1>
        <div>To begin, load your save file below</div>
        <FileSelector onFileLoad={showFile} />
        <div style={{ margin: '10px' }}>
          <span>DataSize: {dataSize}</span>
          <span> SaveDataSize: {saveDataSize}</span>
        </div>

        <AceEditor
          mode="xml"
          theme="monokai"
          onChange={setXml}
          width="100%"
          value={xml}
          name="saveEditor"
          editorProps={{ $blockScrolling: true, $width: '100%' }}
        />

        <Button onClick={downloadTxtFile}>Download!</Button>
      </div>
    </div>
  );
}

export default App;
