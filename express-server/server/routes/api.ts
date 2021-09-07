// Import dependencies
import { Router } from 'express';
import http from 'http';
const router = Router();

// GET api listing.
router.get('/', (_req, res) => {
    res.send('api works with nodemon!!');
});

export default router;
