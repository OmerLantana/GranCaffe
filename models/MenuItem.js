// MenuItem.js

import mongoose from 'mongoose';

// Define Enum values for category and subcategory
const categoryEnum = ['Food', 'Beverages'];
const subcategoryEnum = ['Breakfast', 'Starters', 'Soup','Salad','Main','Side Dishes','Risotto & Pasta','Pizza','Kids Menu','Eclair','Gelato','Blue Cheesecake','Coffee','Tea','Juices & Milkshakes','Soft Drinks & Water',];

// Define the schema for the MenuItem
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, enum: categoryEnum, required: true },
    subcategory: { type: String, enum: subcategoryEnum, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create and export the MenuItem model
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
