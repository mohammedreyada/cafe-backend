require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');

const User = require('../src/models/User.model');
const Category = require('../src/models/Category.model');
const Product = require('../src/models/Product.model');

// بيانات تجريبية
const users = [
    {
        name: 'Cafe Admin',
        email: 'admin@thegarden.com',
        password: 'password123',
        role: 'Admin',
        phone: '01000000000'
    },
    {
        name: 'Test User',
        email: 'user@thegarden.com',
        password: 'password123',
        role: 'User',
        phone: '01111111111'
    }
];

const categories = [
    { name: 'Hot Drinks', description: 'Coffee, Tea, and more' },
    { name: 'Cold Drinks', description: 'Iced coffees, juices, and mocktails' },
    { name: 'Breakfast', description: 'Morning meals' },
    { name: 'Desserts', description: 'Sweet treats' },
    { name: 'Shisha', description: 'Premium shisha flavors' }
];

const products = [
    { name: 'Espresso', description: 'Double shot', price: 25, category: 'Hot Drinks', stockQuantity: 100 },
    { name: 'Cappuccino', description: 'With foamy milk', price: 35, category: 'Hot Drinks', stockQuantity: 50 },
    { name: 'Iced Latte', description: 'Chilled coffee', price: 40, category: 'Cold Drinks', stockQuantity: 30 },
    { name: 'Croissant', description: 'Buttery pastry', price: 30, category: 'Breakfast', stockQuantity: 20 },
    { name: 'Chocolate Cake', description: 'Fudgy', price: 45, category: 'Desserts', stockQuantity: 10 },
    { name: 'Double Apple', description: 'Premium shisha', price: 60, category: 'Shisha', stockQuantity: 200 }
];

// دالة زراعة البيانات
const importData = async () => {
    try {
        await connectDB();
        
        // مسح البيانات القديمة
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();

        // 1. زراعة المستخدمين (مع تشفير الباسورد)
               const createdUsers = [];
        for (const user of users) {
            const newUser = await User.create(user); // سيتم التشفير تلقائياً في User.model.js
            createdUsers.push(newUser);
        }
        console.log('Users Seeded!');

        // 2. زراعة التصنيفات
        const createdCategories = await Category.insertMany(categories);
        console.log('Categories Seeded!');

        // 3. زراعة المنتجات وربطها بالتصنيفات
        const productsToInsert = products.map(prod => {
            const categoryObj = createdCategories.find(cat => cat.name === prod.category);
            return { ...prod, category: categoryObj._id };
        });

        await Product.insertMany(productsToInsert);
        console.log('Products Seeded!');

        console.log('✅ Data Import Complete!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error importing data: ${error.message}`);
        process.exit(1);
    }
};

// دالة مسح البيانات
const destroyData = async () => {
    try {
        await connectDB();
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

// تشغيل السكريبت
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
