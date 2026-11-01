const express = require('express');
const app = express()
const connectDB = require('./config/dbConnection')
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const skillRoutes = require('./routes/skillRoutes')
const matchRoutes = require('./routes/matchRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const skillCatalogueRoutes = require('./routes/skillCatalogueRoutes')

require('dotenv').config()

connectDB()
const port = process.env.PORT || 3000

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(cookieParser()) 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/skill-catalogue", skillCatalogueRoutes);

app.listen(port, () => {
  console.log(`Skillswap app listening on port ${port}`)
})