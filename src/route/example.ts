import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Example route');
});

export default router;
