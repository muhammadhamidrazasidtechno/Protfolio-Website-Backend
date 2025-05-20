const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes"); // NOT registerRoutes

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint is working!" });
});

app.use("/api", apiRoutes); // Proper router

const port = 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Backend server running on http://localhost:${port}`);
  });
}

module.exports = app;
