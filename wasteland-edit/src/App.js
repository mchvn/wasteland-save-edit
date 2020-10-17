import React, { useState } from 'react';
import './App.css';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-monokai";
import 'brace/ext/searchbox'
import FileSelector from './components/FileSelector'
import {Button} from './components/Button'
import DecompressionWorker from './utils/decompression.worker.js';
import {recompress} from './utils/compression'

function App() {

  const [xml, setXml] = useState("<empty/>");
  const [saveData, setSaveData] = useState("");
  const [dataSize, setDataSize] = useState(0); //decompressed, should be bigger
  const [saveDataSize, setSaveDataSize] = useState(0); //compressed, should be smaller
  const [fileName, setFileName] = useState('');
  const [isSaved, setSaved] = useState(false);

  //create a worker so that the decompression doesn't lock the UI
  const worker = new DecompressionWorker();
  worker.onmessage = (e) => {
    const { fileName, xml, dataSize, saveDataSize } = e.data
    setXml(xml)
    setDataSize(dataSize)
    setSaveDataSize(saveDataSize)
    setFileName(fileName)
  }

  /**
   * Create a file and download it (a bit workaroundy, but it works)
   */
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([saveData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  }

  /**
   * Stage the file to be downloaded
   * Recompress, and calculate new metadata
   */
  const save = () => {
    const { newData, dSize, sdSize } = recompress(xml)
    setSaveData(newData)
    console.log(dSize, sdSize)
    setDataSize(dSize)
    setSaveDataSize(sdSize)
    setSaved(true)
  }

  /**
   * Decompresses and displays file in editor
   * @param {Blob[]} files 
   */
  const loadFile = async (files) => {
    setXml('Processing...')
    worker.postMessage(files[0])  //just take the first file if mulitple are uploaded... in the future maybe show an error
  }

  /**
   * When the user makes a change to the XML, set the save state to unsaved to hide the download button
   * because the data will need to be recompressed before downloading
   * @param {string} newData 
   */
  const updateXml = (newData) => {
    setXml(newData)
    setSaved(false)
  }

  return (
    <div className="App" style={{ margin: 0 }}>
      <div style={{ margin: '10px' }}>
        <h1>Wasteland 3 Save Editor</h1>
        <div>To begin, load your save file below</div>
        <FileSelector onFileLoad={loadFile} />
        <AceEditor
          mode="xml"
          theme="monokai"
          onChange={updateXml}
          width="100%"
          value={xml}
          name="saveEditor"
          editorProps={{ $blockScrolling: true, $width: '100%' }}
        />
        <Button onClick={save}>Generate savefile</Button>
        {isSaved ?
          <>
            <Button onClick={downloadTxtFile}>Download!</Button>
            <div>Use these values to update the corresponding metadata file:</div>
            <div style={{ margin: '10px 0' }}>
              <span>DataSize: {dataSize}</span>
              <span> SaveDataSize: {saveDataSize}</span>
            </div>
          </>
          : null}
      </div>

    </div>
  );
}

export default App;
