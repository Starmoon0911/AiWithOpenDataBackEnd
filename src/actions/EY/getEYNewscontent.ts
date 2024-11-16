import axios from 'axios';
import * as cheerio from 'cheerio';
import EYnewsModel from '../../database/schemas/EYnews';

// 爬取單條新聞的詳細內容
async function fetchNewsContent(url: string): Promise<{ content: string; image: string[] } | null> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // 解析內容和圖片
    const content = $('.words_content').text().trim(); // 假設這是詳細內容的選擇器
    const images: string[] = [];
    $('.photo_two li a').each((_, element) => {
      let imageUrl = $(element).attr('href');
      if (imageUrl) {
        // 為圖片網址添加前綴
        if (!imageUrl.startsWith('http')) {
          imageUrl = `https://www.ey.gov.tw${imageUrl}`;
        }
        images.push(imageUrl.trim());
      }
    });

    return { content, image: images };
  } catch (error) {
    console.error(`Error fetching content for URL ${url}:`, error);
    return null;
  }
}

// 更新 MongoDB 中的新聞詳細內容
async function updateEYnewsContent() {
  try {
    // 查找所有沒有 content 的新聞項目
    const newsItems = await EYnewsModel.find({ content: { $exists: false } });

    console.log(`Found ${newsItems.length} news items to update.`);

    for (const newsItem of newsItems) {
      console.log(`Fetching content for: ${newsItem.title}`);
      const contentData = await fetchNewsContent(newsItem.link);

      if (contentData) {
        // 更新資料庫中的 content 欄位
        newsItem.content = contentData;
        await newsItem.save();
        console.log(`Updated content for: ${newsItem.title}`);
      } else {
        console.warn(`Failed to fetch content for: ${newsItem.title}`);
      }
    }

    console.log('All news items have been processed.');
  } catch (error) {
    console.error('Error updating news content:', error);
  }
}

export default updateEYnewsContent;
