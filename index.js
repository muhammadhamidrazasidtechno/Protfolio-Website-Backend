const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");

const app = express();

// Configure CORS to allow both localhost and Vercel URL
const allowedOrigins = [
  "http://localhost:3000", // Default server port
  "http://localhost:5000", // Common Vite/React front-end port (adjust if different)
  "https://muhammad-hamid-raza.vercel.app", // Your Vercel app
  "https://muhammad-mustafa-mu.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, // Enable if you need cookies or auth headers
  })
);

// Handle CORS preflight requests explicitly
app.options("*", cors());

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint is working!" });
});

app.use("/api", apiRoutes);

const port = 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Backend server running on http://localhost:${port}`);
  });
}

module.exports = app;
