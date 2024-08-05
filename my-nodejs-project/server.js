const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://davexuma7:Davis2024@cluster0.08wlnh1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Define MongoDB schema and model
const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  vipPrice: Number,
  regularPrice: Number,
  maxAttendees: Number
});
const Event = mongoose.model('Event', eventSchema);

// Create a transporter object using SMTP transport (Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bellamysmith97@gmail.com',  // Your Gmail email address
    pass: 'rev@2022'                   // Your Gmail password or app-specific password
  }
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the admin.html file
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Route to fetch events from the database
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Route to add a new event
app.post('/events', async (req, res) => {
  const { name, date, vipPrice, regularPrice, maxAttendees } = req.body;
  const newEvent = new Event({ name, date, vipPrice, regularPrice, maxAttendees });
  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Route to update an event
app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, vipPrice, regularPrice, maxAttendees } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, { name, date, vipPrice, regularPrice, maxAttendees }, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Route to delete an event
app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Event.findByIdAndDelete(id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Route to handle reservation and send email notification
app.post('/reserve', async (req, res) => {
  const { eventId, ticketType, quantity, userEmail } = req.body;

  const mailOptions = {
    from: 'bellamysmith97@gmail.com',
    to: userEmail,
    subject: 'Reservation Confirmation',
    text: 'Your tickets have been successfully reserved.'
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent');
    res.json({ message: 'Reservation successful' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email notification' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
