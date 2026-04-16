const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// APIs
app.use("/api/admin", require("./api/admin.js"));
app.use("/api/customer", require("./api/customer.js"));

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// ✅ STATIC FRONTEND (QUAN TRỌNG)
const path = require("path");

// Admin
app.use(
  "/admin",
  express.static(path.join(__dirname, "..", "client-admin", "build"))
);

app.get("/admin/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "client-admin", "build", "index.html")
  );
});

// Customer
app.use(
  "/",
  express.static(path.join(__dirname, "..", "client-customer", "build"))
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "client-customer", "build", "index.html")
  );
});

// ✅ ERROR HANDLER (đặt cuối cùng)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
