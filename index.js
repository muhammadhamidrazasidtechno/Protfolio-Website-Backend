const express = require("express");
const cors = require("cors");
const { registerRoutes } = require("./routes");

// Simple log function (since vite.js isn't provided)
function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();

// ✅ CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman or no origin requests

      if (app.get("env") === "development") {
        return callback(null, true);
      }

      const allowedOrigins = [
        "https://muhammad-hamid-raza.vercel.app/",
        "http://localhost:5173", // if testing locally
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🔍 Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Register routes
registerRoutes(app);

// 🌐 Global error handler
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  log(`Error: ${message}`, "error");
  res.status(status).json({ message });
});

// Start backend only for local development
const port = 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, "0.0.0.0", () => {
    log(`Backend server running on http://localhost:${port}`);
  });
}

// Export the app for Vercel
module.exports = app;
