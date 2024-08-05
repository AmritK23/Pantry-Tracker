'use client'
import { useRef, useState } from 'react'
import { Widget } from '@uploadcare/react-widget'
import { Button } from '@mui/material'

export default function ImageUpload() {
  const [imageUrl, setImageUrl] = useState(null)
  const widgetRef = useRef()

  const handleUpload = (fileInfo) => {
    setImageUrl(fileInfo.cdnUrl)
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
        publicKey="YOUR_UPLOADCARE_PUBLIC_KEY"
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
