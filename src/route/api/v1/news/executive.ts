import EYnewsModel from '../../../../database/schemas/EYnews';
import express from 'express';
import { isValidObjectId } from 'mongoose';
const router = express.Router();
import { Response, Request } from 'express';

router.get('/', async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const page = parseInt(req.query.page as string) || 1;
    const type = (req.query.type as 'reading' | 'all') || 'all';
    const id = req.query.id as string | undefined;

    try {
        if (limit > 30) {
            return res.status(400).json({ success: false, data: "回傳資料數超過限制!(30)" });
        }
        if (id && !isValidObjectId(id)) {
            return res.status(400).json({ success: false, data: "id格式錯誤!" });
        }

        const skip = (page - 1) * limit;
        let query: any = {};

        if (id) {
            query._id = id;
            const newsItem = await EYnewsModel.findOne(query);
            if (!newsItem) {
                return res.status(404).json({ success: false, data: "找不到符合的資料!" });
            }
            return res.status(200).json({ success: true, data: newsItem });
        }

        let news = await EYnewsModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);
        const total = await EYnewsModel.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        if (news.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "沒有符合條件的資料" });
        }

        let data;
        if (type === 'reading') {
            data = news.map((item) => ({
                agent: item.agent,
                date: item.date,
            }));
        } else {
            data = news;
        }

        if (page === totalPages) {
            return res.status(200).json({ success: false, data: "已經沒有更多資料了!" });
        }

        res.status(200).json({
            success: true,
            data: data,
            total: total,
            page: page,
            totalPages: totalPages,
        });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
});

export default router;
