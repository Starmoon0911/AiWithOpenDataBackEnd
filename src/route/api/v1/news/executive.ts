import EYnewsModel from '../../../../database/schemas/EYnews';
import express from 'express'
import fetchEYNews from '../../../../fetch/getEYnews';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const news = await EYnewsModel
            .find()
            .sort({ date: -1 })
            .limit(5);
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, data: error })
    }
})

export default router

