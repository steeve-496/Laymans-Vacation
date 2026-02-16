const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

process.on("unhandledRejection", err => {
    console.error("Unhandled rejection:", err);
});

// Force restart


const bodyParser = require('body-parser');

const compression = require('compression');

// Middleware
app.use(compression()); // Compress all responses
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());



// Custom logging removed for production stability

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

        // Allowed Origins
        const allowedOrigins = [
            "https://laymansvacation.com",
            "https://www.laymansvacation.com",
            "https://laymans-vacation-production.up.railway.app"
        ];

        // Allow localhost (any port)
        if (origin.match(/^http:\/\/localhost/) ||
            origin.match(/^http:\/\/127\.0\.0\.1/) ||
            allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log(`[CORS] Blocked origin: ${origin}`);
        return callback(null, false); // Return false instead of blocking error to avoid crashing? Standard is Error.
        // return callback(new Error('Not allowed by CORS')); 
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.get('/', (req, res) => {
    res.send('Layman\'s Vacation API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const destinationRoutes = require('./routes/destination.routes');
const packageRoutes = require('./routes/package.routes');
const contentRoutes = require('./routes/content.routes');
const stateExplorerRoutes = require('./routes/stateExplorer.routes');
const auditRoutes = require('./routes/audit.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const blogRoutes = require('./routes/blog.routes');
const galleryRoutes = require('./routes/gallery.routes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/state-explorer', stateExplorerRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery', galleryRoutes);




const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);

    // DIAGNOSTIC: Check DB counts on startup
    const prisma = require('./prismaClient');
    // const prisma = new PrismaClient(); // Removed to use singleton
    prisma.admin.count().then(c => console.log(`[STARTUP] Admin Count: ${c}`));
    prisma.destination.count().then(c => console.log(`[STARTUP] Destination Count: ${c}`));
    prisma.destination.findMany({ select: { name: true } }).then(d => console.log(`[STARTUP] Dest Names: ${JSON.stringify(d)}`));
});

// Fix for 502 Bad Gateway (Keep-Alive Timeouts)
// Ensure Node's timeout is longer than the Load Balancer's (usually 60s)
server.keepAliveTimeout = 65000; // 65 seconds
server.headersTimeout = 70000;   // 70 seconds
