import ratelimit from '../config/upstrash.js';


const rateLimiter = async (req, res, next) => {
    try {
       
        const result = await ratelimit.limit("my_rate_limit");
        if (!result.success) {
            return res.status(429).json({ error: 'Too many requests, please try again later.' });
        }
        next();

    } catch (error) {
        console.error('Rate limiter error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
}

export default rateLimiter;