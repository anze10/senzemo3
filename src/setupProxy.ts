import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

module.exports = function(app: { use: (arg0: string, arg1: RequestHandler) => void; }) {
    app.use(
        '/printers',
        createProxyMiddleware({
            target: 'http://localhost:631',
            changeOrigin: true,
        })
    );
};
