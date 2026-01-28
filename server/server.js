const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Force restart


const bodyParser = require('body-parser');

const compression = require('compression');

// Middleware
app.use(compression()); // Compress all responses
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Caching Middleware for Public Data
app.use((req, res, next) => {
    // Cache GET requests for public content for 1 hour (3600s)
    /*
    if (req.method === 'GET' &&
        (req.url.startsWith('/api/destinations') ||
            req.url.startsWith('/api/packages') ||
            req.url.startsWith('/api/state-explorer'))) {

        // Don't cache admin routes
        if (!req.url.includes('/admin')) {
            res.set('Cache-Control', 'public, max-age=3600');
        }
    }
    */
    next();
});

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
        if (origin.match(/^http:\/\/localhost/) ||
            origin.match(/^http:\/\/127\.0\.0\.1/) ||
            origin.match(/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}/) ||
            origin === "http://ec2-43-205-228-13.ap-south-1.compute.amazonaws.com" ||
            origin === "https://laymans-vacation.onrender.com") {
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
const inquiryRoutes = require('./routes/inquiry.routes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/state-explorer', stateExplorerRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);

    // DIAGNOSTIC: Check DB counts on startup
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    prisma.admin.count().then(c => console.log(`[STARTUP] Admin Count: ${c}`));
    prisma.destination.count().then(c => console.log(`[STARTUP] Destination Count: ${c}`));
    prisma.destination.findMany({ select: { name: true } }).then(d => console.log(`[STARTUP] Dest Names: ${JSON.stringify(d)}`));
});
