import React from 'react';
import { useDropzone } from 'react-dropzone'
import styled from '@emotion/styled'


const DropZone = styled.div`
border: 2px dashed #ddd;
border-radius: 4px;
padding: 10px 10px;
cursor: pointer;
width: fit-content;
margin:10px;
`

export default function FileSelector(props) {

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: props.onFileLoad })

  return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <DropZone>
            Drop your save file here, or click to select it...
        </DropZone>
      </div>
  )
}