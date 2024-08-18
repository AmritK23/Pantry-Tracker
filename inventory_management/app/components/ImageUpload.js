'use client'
import { useRef, useState } from 'react'
import { Widget } from '@uploadcare/react-widget'
import { Button } from '@mui/material'

export default function ImageUpload({ onUpload }) {
  const [imageUrl, setImageUrl] = useState(null)
  const widgetRef = useRef()

  const handleUpload = (fileInfo) => {
    const url = fileInfo.cdnUrl;
    setImageUrl(url);
    onUpload(url); // Pass the URL to the parent component
  }

  const handleTakePicture = () => {
    widgetRef.current.openDialog('camera')
  }

  return (
    <div>
      <Button variant="contained" onClick={handleTakePicture}>
        Take Picture
      </Button>
      <Widget
        ref={widgetRef}
        publicKey="2f762a0f0271aa8d53a2"
        onChange={handleUpload}
        imagesOnly
        previewStep
        clearable
        crop="1:1"
        imageShrink="1024x1024"
        sourceList={['camera']}
        systemDialog={true}
      />
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '200px', marginTop: '10px' }} />}
    </div>
  )
}
