//controller for user

import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define user interface based on the model
interface IUser {
    userId: string;
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    gender?: 'Male' | 'Female';
    weight?: number;
    height?: number;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
    goal?: 'Weight Loss' | 'Muscle Gain' | 'Maintenance';
    isAdmin: boolean;
}

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { 
            email, 
            password,
            firstName,
            lastName,
            age,
            gender,
            weight,
            height,
            level,
            goal
        } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Validate enum fields if provided
        if (gender && !['Male', 'Female'].includes(gender)) {
            return res.status(400).json({ error: 'Invalid gender value' });
        }
        if (level && !['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
            return res.status(400).json({ error: 'Invalid level value' });
        }
        if (goal && !['Weight Loss', 'Muscle Gain', 'Maintenance'].includes(goal)) {
            return res.status(400).json({ error: 'Invalid goal value' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        
        const user = new User({
            email,
            passwordHash,
            firstName,
            lastName,
            age,
            gender,
            weight,
            height,
            level,
            goal
        });
        
        await user.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.userId, email: user.email, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
                userId: user.userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                level: user.level,
                goal: user.goal
            }
        });
    } catch (error) {
        // Check for duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Error registering user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.userId, email: user.email, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(200).json({ 
            message: 'Login successful',
            token,
            user: {
                userId: user.userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                level: user.level,
                goal: user.goal
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: Function) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as IUser;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};


