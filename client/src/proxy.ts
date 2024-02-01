import proxy from "http-proxy-middleware"

proxy.createProxyMiddleware(`/auth/**`, { target: "http://localhost:4080" });

