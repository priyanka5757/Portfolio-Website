import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import hbs from 'hbs';
import bcrypt from 'bcrypt';
import path from 'path';

// Models
import User from './models/user.model.js';



// Env Config
dotenv.config();

// Env Variables
const app = express();
const port  = process.env.PORT || 3000;
const db_uri = process.env.MONGODB_URI;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Template Engine hbs
app.set('view engine', 'hbs');

// Using Static Files
app.use(express.static('public'));
app.use(express.static('assests'));



// Routes

// Home Route
app.get('/home', (req, res) => {
  res.render('home', {
    title: 'Home',
    message: 'Welcome to the homepage!'
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us',
    message: 'Learn more about us here.'
  });
});

// Projects Route
app.get('/projects', (req, res) => {
  res.render('projects', {
    title: 'Projects',
    message: 'Check out our projects!'
  });
});
//Projet-post Routes
app.get('/project-post', (req, res) => {
    res.render('project-post', {
        title: 'Project-post',
        message: 'Read my project to know about it!'
    })
})

// Handcraft Route
app.get('/handcraft', (req, res) => {
  res.render('handcraft', {
    title: 'Handcraft',
    message: 'Explore our handcraft collection.'
  });
});

// Contact Route
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    message: 'Get in touch with us.'
  });
});

// Login Route (GET) - Served at the root
app.get('/', (req, res) => {
  res.render('login', {
    title: 'Login Page'
  });
});

// Handle user login (POST) - Serve at the root
app.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found!');
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid password!');
    }

    res.send(`Welcome ${user.firstName}! You are logged in.`);
  } catch (err) {
    res.status(500).send('Error logging in: ' + err);
  }
});

// Registration Route (GET) - Served at the root with login form
app.get('/register', (req, res) => {
  res.render('register', {
    title: 'Registration Form'
  });
});

// Handle user registration (POST) - Served at the root
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, phoneNo, gender, address, password } = req.body;

  try {
    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists!');
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const newUser = new User({ firstName, lastName, email, phoneNo, gender, address, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res.send('User registered successfully!');
  } catch (err) {
    res.status(500).send('Error registering user: ' + err);
  }
});

// Database Connection
mongoose.connect(db_uri).then(() => {
  console.log("MongoDB Connected");
}).catch((err) => {
  console.error("Connection Failed", err);
});

// Port that app run
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});