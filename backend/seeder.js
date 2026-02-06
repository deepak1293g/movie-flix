import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Movie from './models/movieModel.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/d-flix')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const importData = async () => {
    try {
        await User.deleteMany();

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: '123', // Will be hashed by pre-save hook
            isAdmin: true
        });

        console.log('Data Imported!');
        console.log('Admin Credentials:');
        console.log('Email: admin@example.com');
        console.log('Password: 123');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
