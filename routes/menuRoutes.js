import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { isAdmin, isAuth } from '../utils.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const router = express.Router();

// Configure Cloudinary with your cloud credentials
cloudinary.config({ 
  cloud_name: 'du4bjonbf', 
  api_key: '662952589247199', 
  api_secret: 'DrXZkhi3WOLUcVwgkpBdC-UWkmM' 
});

// Use CloudinaryStorage to configure multer for image upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

const upload = multer({ storage });

// Middleware for Cloudinary image upload
const uploadImageToCloudinary = upload.single('image');

// Route to add a new menu item (only accessible to admin users)
router.post('/addmenuitem', isAuth , isAdmin,  uploadImageToCloudinary, async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const { name, price, description, category, subcategory } = req.body;
        const image = req.file.path; // Get the uploaded image URL from the request

        // Create a new MenuItem document
        const newItem = new MenuItem({
            name,
            price,
            description,
            image,
            category,
            subcategory
        });

        // Save the new MenuItem to the database
        const savedItem = await newItem.save();

        res.status(201).json(savedItem); // Respond with the saved item
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ message: 'Error adding menu item' });
    }
});


// Route to get all menu items
router.get('/allmenuitems', async (req, res) => {
    try {
        const allMenuItems = await MenuItem.find();
        res.json(allMenuItems);
    } catch (error) {
        console.error('Error fetching all menu items:', error);
        res.status(500).json({ message: 'Error fetching all menu items' });
    }
});

// Route to delete a menu item by ID (only accessible to admin users)
router.delete('/deletemenuitem/:id', isAuth, isAdmin, async (req, res) => {
    try {
        const itemId = req.params.id;
        const deletedItem = await MenuItem.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ message: 'Error deleting menu item' });
    }
});

// Route to edit a menu item by ID (only accessible to admin users)
router.put('/editmenuitem/:id', isAuth, isAdmin, uploadImageToCloudinary, async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, price, description, category, subcategory } = req.body;
        
        // Check if an image was uploaded, if not, use the existing image URL
        const image = req.file ? req.file.path : req.body.image;

        // Find the menu item by ID and update its fields
        const updatedItem = await MenuItem.findByIdAndUpdate(itemId, {
            name,
            price,
            description,
            image,
            category,
            subcategory
        }, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json(updatedItem); // Respond with the updated item
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ message: 'Error updating menu item' });
    }
});



export default router;
