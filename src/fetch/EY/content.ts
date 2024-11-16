import axios from 'axios';
import * as cheerio from 'cheerio';

interface NewsItem {
  title: string;
  date: string;
  description: string;
  imageUrls: string[];
}

async function fetchNews(): Promise<NewsItem[]> {
  try {
    const url = 'https://www.ey.gov.tw/Page/9277F759E41CCD91/8e367945-2aca-4176-b502-7d1ca0d562a5'; // 替換為真實新聞頁面的 URL
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const newsItems: NewsItem[] = [];

    // 根據提供的 HTML 結構進行抓取
    $('.graybg.ail').each((_, element) => {
      const title = $(element).find('.h2').text().trim();
      const date = $(element).find('.date_style2 span').first().text().trim();
      const description = $(element).find('.words_content .data_left p').text().trim();

      // 取得所有圖片的網址
      const imageUrls: string[] = [];
      $(element).find('.photo_two li a').each((_, imgElement) => {
        const imageUrl = $(imgElement).attr('href');
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      });

      newsItems.push({
        title,
        date,
        description,
        imageUrls,
      });
    });

    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

fetchNews().then((newsItems) => {
  console.log(newsItems); // 輸出爬取的新聞資料
});
