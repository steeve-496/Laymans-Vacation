const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Force restart


const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// AUTO-DEBUGGING: Write logs to file
const fs = require('fs');
const path = require('path');
const util = require('util');
const logFile = fs.createWriteStream(path.join(__dirname, 'server_debug.txt'), { flags: 'a' });
const logStdout = process.stdout;

console.log = function (...args) {
    const formatted = util.format(...args);
    logFile.write(formatted + '\n');
    logStdout.write(formatted + '\n');
};
console.error = function (...args) {
    const formatted = util.format(...args);
    logFile.write('[ERROR] ' + formatted + '\n');
    logStdout.write('[ERROR] ' + formatted + '\n');
};

console.log("Loaded DATABASE_URL: " + (process.env.DATABASE_URL ? "Defined (starts with " + process.env.DATABASE_URL.substring(0, 15) + ")" : "UNDEFINED"));

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow localhost and local network IPs
        // Regex matches localhost, 127.0.0.1, and 192.168.x.x
        if (origin.match(/^http:\/\/localhost/) ||
            origin.match(/^http:\/\/127\.0\.0\.1/) ||
            origin.match(/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}/)) {
            return callback(null, true);
        }

        // Block other origins
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Layman\'s Vacation API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const destinationRoutes = require('./routes/destination.routes');
const packageRoutes = require('./routes/package.routes');
const contentRoutes = require('./routes/content.routes');
const stateExplorerRoutes = require('./routes/stateExplorer.routes');
const auditRoutes = require('./routes/audit.routes'); // Added import for audit routes

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/state-explorer', stateExplorerRoutes);
app.use('/api/audit', auditRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
