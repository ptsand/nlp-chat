import rateLimit from "express-rate-limit";
// setup req rate limiting
export const generalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 80
});

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 6, // Limit each IP to 6 requests per `window`
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});