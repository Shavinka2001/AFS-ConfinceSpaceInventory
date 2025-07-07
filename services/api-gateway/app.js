const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const { applyRateLimiter } = require("./utils/rateLimitter")
const app = express();
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000','http://localhost:5000','http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
//host.docker.internal
// app.use("/api/users", applyRateLimiter, proxy("host.docker.internal:5001"));
app.use("/api/users", applyRateLimiter, proxy("http://auth:5001", {
  proxyErrorHandler: function (err, res, next) {
    console.error('Proxy error for /api/users:', err.message);
    res.status(500).json({
      success: false,
      message: 'Service temporarily unavailable',
      error: err.message
    });
  }
}));
app.use("/api/auth", (req, res, next) => {
  console.log(`[API-GATEWAY] Received request for /api/auth: ${req.method} ${req.originalUrl}`);
  next();
}, applyRateLimiter, proxy("http://auth:5001", {
  userResDecorator: function(proxyRes, proxyResData, req, res) {
    console.log(`[API-GATEWAY] Response from Auth service for ${req.method} ${req.originalUrl}: Status ${proxyRes.statusCode}`);
    return proxyResData;
  },
  proxyErrorHandler: function (err, res, next) {
    console.error('[API-GATEWAY] Proxy error for /api/auth:', err.message, err.stack);
    res.status(500).json({
      success: false,
      message: 'Authentication service temporarily unavailable',
      error: err.message
    });
  }
}));
app.use(
  "/api/order",
  applyRateLimiter,
  proxy("http://confined-space:5002")
);

app.use("/api/locations", applyRateLimiter, proxy("http://auth:5001", {
  userResDecorator: function(proxyRes, proxyResData, req, res) {
    console.log(`[API-GATEWAY] Response from Auth service for ${req.method} ${req.originalUrl}: Status ${proxyRes.statusCode}`);
    return proxyResData;
  },
  proxyErrorHandler: function (err, res, next) {
    console.error('[API-GATEWAY] Proxy error for /api/locations:', err.message, err.stack);
    res.status(500).json({
      success: false,
      message: 'Location service temporarily unavailable',
      error: err.message
    });
  }
}));

// Error handling middleware for proxy errors
app.use((err, req, res, next) => {
  console.error('API Gateway error:', err.stack || err);
  res.status(500).json({
    success: false,
    message: 'API Gateway encountered an error',
    error: err.message
  });
});
//Exporting app to be used by the server.js
module.exports = app;