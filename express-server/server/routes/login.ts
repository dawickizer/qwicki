// Import dependencies
import { Router } from 'express';
const router = Router();

// GET api listing.
router.post('/', (req, res) => {
    console.log(req.body);
    res.send({...req.body});
});

export default router;
