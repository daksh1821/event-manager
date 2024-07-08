const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const eventRoutes = require('./routes/events');

const app = express();


const formSchema = new mongoose.Schema({
    name: String,
    partnerName: String,
    email: String,
    phone: String,
    location: String,
    eventDate: Date,
    howDidYouFind: String
});

const Form = mongoose.model('Form', formSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.post('/submit-form', (req, res) => {
    const formData = new Form(req.body);
    formData.save()
        .then(() => {
            res.send(`
                <p>Form submitted successfully. You will be redirected to the home page in <span id="countdown">5</span> seconds.</p>
                <script>
                    var countdownElement = document.getElementById('countdown');
                    var countdown = 5;
                    setInterval(function() {
                        countdown--;
                        countdownElement.textContent = countdown;
                        if (countdown === 0) {
                            window.location.href = '/';
                        }
                    }, 1000);
                </script>
            `);
        })
        .catch(err => res.status(400).send('Error submitting form'));
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API Routes
app.use('/api/events', eventRoutes);
app.use(express.static(path.join(__dirname, 'image')));
// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to serving index.html for any route not handled by API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});
app.get("/budget-tracking",(req,res)=>{
    res.sendFile("../frontend/budget-tracking.html",{root:__dirname});
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/service', (req, res) => {
    res.sendFile(path.join(__dirname, 'service.html'));
});
app.get('/pricing', (req, res) => {
    res.sendFile(path.join(__dirname, 'pricing.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
// Database connection
mongoose.connect('mongodb://localhost:27017/eventplanner360', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const port = process.env.PORT || 3006;
app.listen(port, () => console.log(`Server running on port ${port}`));
