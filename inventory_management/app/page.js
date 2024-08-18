'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore'
import ImageUpload from '@/app/components/ImageUpload'
import ObjectDetection from '@/app/components/ObjectDetection' // Import the ObjectDetection component

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // State to store image URL
  const [detectedItem, setDetectedItem] = useState(''); // State to store detected item

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
      updateInventory()
    }
  }

  const addItem = async (item, imageUrl) => {
    if (!item) return; // Prevent empty item names
    if (!imageUrl) return; // Prevent undefined imageUrl
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1, imageUrl }) // Add imageUrl to the document
    } else {
      await setDoc(docRef, { quantity: 1, imageUrl }) // Add imageUrl to the document
    }
    updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleDetection = (predictions) => {
    if (predictions.length > 0) {
      const detectedClass = predictions[0].class.toLowerCase(); // Get the class of the first detected object
      setDetectedItem(detectedClass);
      const existingItem = inventory.find(item => item.name.toLowerCase() === detectedClass);
      if (existingItem) {
        addItem(detectedClass, existingItem.imageUrl); // Increment count if item exists
      } else {
        addItem(detectedClass, imageUrl); // Add new entry if item does not exist
      }
    } else {
      setDetectedItem('');
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute" top="50%" left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex" flexDirection="column" gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button 
              variant="outlined" 
              onClick={() => {
                addItem(itemName, imageUrl)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
          <ImageUpload onUpload={setImageUrl} /> {/* Add ImageUpload component */}
          {imageUrl && <ObjectDetection imageUrl={imageUrl} onDetect={handleDetection} />} {/* Add ObjectDetection component */}
          {detectedItem && <Typography variant="h6">Detected: {detectedItem}</Typography>}
        </Box>
      </Modal>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ maxWidth: '800px', mb: 2 }}
      />
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
          <Typography variant='h2' color='#333'>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            filteredInventory.map(({ name, quantity, imageUrl }) => ( // Include imageUrl in map
              <Box 
                key={name} width="100%"
                minheight="150px"
                display="flex"
                alignItems="center" 
                justifyContent="space-between"
                bgcolor={name.toLowerCase() === searchTerm.toLowerCase() ? '#FFFF00' : '#f0f0f0'}
                padding={5}
              >
                <Typography variant="h3" color='#333' textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color='#333' textAlign="center">
                  {quantity}
                </Typography>
                {imageUrl && <img src={imageUrl} alt={name} style={{ maxWidth: '100px', marginLeft: '10px' }} />} {/* Display image */}
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => {
                    addItem(name, imageUrl)
                  }}
                  >
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => {
                    removeItem(name)
                  }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  )
}
