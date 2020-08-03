const express = require('express');
const router = express.Router();

/_ GET api listing. _/
router.get('/', (req, res) => {
    res.send('api works');
});

module.exports = router;
