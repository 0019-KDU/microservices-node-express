import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// const app = express();
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Disable SSL verification for testing

// Define routes and their ports
const routes = {
  '/auth': 'http://localhost:5001', // Pointing to the auth microservice
  '/post': 'http://localhost:5002',  // Pointing to the post microservice
};

// Create a proxy for each route
for (const route in routes) {
  const target = routes[route];
  app.use(route, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${route}`]: '' }, // Rewriting the path to match the target service
  }));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
