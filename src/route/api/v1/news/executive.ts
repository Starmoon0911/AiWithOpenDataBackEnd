import EYnewsModel from '../../../../database/schemas/EYnews';
import express from 'express';
import { isValidObjectId } from 'mongoose';
const router = express.Router();
import { Response, Request } from 'express';
router.get('/', async (req:Request, res:Response) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const page = parseInt(req.query.page as string) || 1;
    const type = req.query.type as string || 'all';
    const id = req.query.id as string | undefined; // 可選的 ID 查詢參數
    console.log(id)
    try {
        // 如果 limit 超過限制，返回錯誤訊息
        if (limit > 30) res.status(400).json({ success: false, data: "回傳資料數超過限制!(30)" });
        if (id && !isValidObjectId(id)) return res.status(400).json({ success: false, data: "id格式錯誤!" });
        const skip = (page - 1) * limit;

        // 建立查詢條件物件，預設為空
        let query: any = {};

        // 如果有傳入 id，加入查詢條件
        if (id) {
            query._id = id; // Mongoose 查詢使用 _id 屬性
        }

        // 查詢資料
        let news = await EYnewsModel
            .find(query) // 使用 query 來過濾資料
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await EYnewsModel.countDocuments(query); // 計算符合條件的總數

        // 根據 type 進行條件處理
        let data;
        if (type === 'reading') {
            // 只保留 agent 和 date，並強制轉換為正確的型別
            data = news.map((item) => ({
                agent: item.agent,
                date: item.date
            })) as { agent: any; date: Date }[];
        } else {
            // 若 type 不是 'reading'，則回傳全部資料
            data = news;
        }

        res.status(200).json({
            success: true,
            data: data,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
});

export default router;
