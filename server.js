import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import "./config/passport.js";
import { sendEmail } from "./utils/email.js";

import authRoutes from "./routes/authRoutes.js";
import googleRoutes from "./routes/googleAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import permissionRoutes from "./routes/permissionRoute.js";
import routeRoutes from './routes/routeRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import pageRoutes from './routes/pageRoutes.js'
import notificationRoutes from './routes/notificationsRoutes.js';
import messageRoutes from './routes/messagesRoutes.js';
import accountRoutes from './routes/accountDetailsRoutes.js';
import nomineeRoutes from './routes/nomineeRoutes.js';

dotenv.config();
const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ✅ Handle OPTIONS preflight requests
app.options('*', cors(corsOptions));


// ✅ EXPRESS MIDDLEWARE
app.use(express.json());

// ✅ SESSION
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     console.log('Request origin:', req.headers.origin);
//     console.log('Method:', req.method);
//     next();
// });

// ✅ MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes); // ⬅️ includes PATCH /change-password
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/pages", pageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/nominees', nomineeRoutes);

// Test Email 
app.get('/api/test-email', async (req, res) => {
    try {
        await sendEmail({
            to: 'srjkmr431@gmail.com',
            subject: 'Test Email from Nodemailer',
            html: `<h2>Hello from localhost 👋</h2><p>This is a test email sent from Node.js app on localhost using Gmail.</p>`
        });

        res.send("✅ Email sent!");
    } catch (err) {
        console.error("Email sending failed:", err);
        res.status(500).send("❌ Failed to send email.");
    }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

export default app;
