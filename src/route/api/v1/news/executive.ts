import EYnewsModel from '../../../../database/schemas/EYnews';
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const page = parseInt(req.query.page as string) || 1;
    try {
        if (limit > 30) res.status(400).json({ success: false, data: "回傳資料數超過限制!(30)" })

        const skip = (page - 1) * limit;

        const news = await EYnewsModel
            .find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        const total = await EYnewsModel.countDocuments();
        res.status(200).json({
            success: true,
            data: news,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
});

export default router;
