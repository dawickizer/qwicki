// Import dependencies
import { Router } from 'express';
const router = Router();

// GET api listing.
router.get('/', (_req, res) => {
    res.send('attempting to login');
});

export default router;
