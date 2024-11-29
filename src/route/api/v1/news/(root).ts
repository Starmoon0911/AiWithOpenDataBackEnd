import express from 'express';
import EducationNewsModel from '../../../../database/schemas/educationNews';
import EYnewsModel from '../../../../database/schemas/EYnews';
const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
    const limit = parseInt(req.query.limit as string) || 5;  // 每頁顯示的資料數量
    const page = parseInt(req.query.page as string) || 1;    // 當前頁數

    try {
        const skip = (page - 1) * limit;  // 計算跳過的資料數量

        // 從兩個模型中查詢資料
        const educationNews = await EducationNewsModel.find({}).sort({ date: -1 }).exec();
        const eyNews = await EYnewsModel.find({}).sort({ date: -1 }).exec();

        // 合併兩個資料集合
        const combinedNews = [...educationNews, ...eyNews];

        // 根據日期排序
        const sortedNews = combinedNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // 計算總頁數
        const total = sortedNews.length;
        const totalPages = Math.ceil(total / limit);

        // 應用分頁
        const pagedNews = sortedNews.slice(skip, skip + limit);

        // 回傳結果給前端
        if (pagedNews.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "沒有符合條件的資料" });
        }

        res.status(200).json({
            success: true,
            data: pagedNews,
            total: total,
            page: page,
            totalPages: totalPages,
        });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
});

export default router;
