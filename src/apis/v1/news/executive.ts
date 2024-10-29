import fetchNews from "../../../../test/fectch";
import express from 'express'
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const news = await fetchNews();
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, data: error })
    }
})

export default router

