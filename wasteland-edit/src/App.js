import React, { useState, useEffect } from 'react';
import './App.css';
import AceEditor from "react-ace";
import { formatXml, unformat } from './utils/format'
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-monokai";
import styled from '@emotion/styled'
import 'brace/ext/searchbox'
import FileSelector from './components/FileSelector'
import { compress, decompress } from './utils/compression'
import DecompressionWorker from './utils/decompression.worker.js';


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


  /**
   * Deformats and recompresses data.
   * @param {string} data 
   */
  const recompress = (data) => {
    const unformatted = unformat(data)
    const newData = compress(unformatted)
    return { newData, dataSize: unformatted.length, saveDataSize: newData.byteLength }
  }

  /**
   * Create a file and download it (a bit workaroundy, but it works)
   */
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const { newData, dSize, sdSize } = recompress(xml)
    const file = new Blob([newData], { type: 'text/plain' });
    setDataSize(dSize)
    setSaveDataSize(sdSize)

    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  }


  const doThing = () => {
   
  }


  /**
   * Displays file in editor
   * @param {Blob[]} files 
   */
  const showFile = async (files) => {
     //.postMessage(files)  //just take the first file if mulitple are uploaded... in the future maybe show an error
  }



  return (
    <div className="App" style={{ margin: 0 }}>
      <div style={{ margin: '10px' }}>
        <input type="file" onChange={(e) => showFile(e)} />
      </div>
      <FileSelector onFileLoad={showFile} />
      <div style={{ margin: '10px' }}>
        <span>DataSize: {dataSize}</span>
        <span>SaveDataSize: {saveDataSize}</span>
      </div>

      <AceEditor
        mode="xml"
        theme="monokai"
        onChange={setXml}
        width="100%"
        value={xml}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true, $width: '100%' }}
      />

      <Button onClick={doThing}>Download!</Button>
    </div>
  );
}

export default App;
