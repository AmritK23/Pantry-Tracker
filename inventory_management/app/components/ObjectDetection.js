'use client'
import { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function ObjectDetection({ imageUrl, onDetect }) {
  const [model, setModel] = useState(null);
  const imageRef = useRef();

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (model && imageUrl) {
      detectObjects();
    }
  }, [model, imageUrl]);

  const detectObjects = async () => {
    const img = imageRef.current;
    img.crossOrigin = 'anonymous'; // Set crossOrigin attribute
    const predictions = await model.detect(img);
    onDetect(predictions);
  };

  return (
    <div>
      <img ref={imageRef} src={imageUrl} alt="To be detected" style={{ display: 'none' }} crossOrigin="anonymous" />
    </div>
  );
}
