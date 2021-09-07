// Import dependencies
import { Router } from 'express';
import http from 'http';
const router = Router();

// GET api listing.
router.get('/', (_req, res) => {
    res.send('api works with nodemon!!');

    http.get('http://colyseus-chat:2567', (resp) => {

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
});

export default router;
