import axios from 'axios';
import * as cheerio from 'cheerio';
import EYnewsModel, { Image } from '../../database/schemas/EYnews';
import generateImagesDescription from '../../agent/EY/generateImagesDescription';

// 爬取單條新聞的詳細內容
async function fetchNewsContent(url: string): Promise<{ content: string; images: Image[] } | null> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const content = $('.words_content').text().trim(); // 假設這是詳細內容的選擇器
    const images: Image[] = [];
    $('.photo_two li a').each((_, element) => {
      let imageUrl = $(element).attr('href');
      if (imageUrl) {
        if (!imageUrl.startsWith('http')) {
          imageUrl = `https://www.ey.gov.tw${imageUrl}`;
        }
        images.push({ url: imageUrl.trim(), desc: '' }); // 預設描述為空
      }
    });

    return { content, images };
  } catch (error) {
    console.error(`Error fetching content for URL ${url}:`, error);
    return null;
  }
}

// 更新圖片描述
async function updateImageDescriptions(images: Image[]): Promise<void> {
  for (const image of images) {
    if (!image.desc) {
      console.log(`Generating description for image: ${image.url}`);
      try {
        const generatedDescription = await generateImagesDescription(image.url); // 呼叫生成描述的函數

        if (generatedDescription?.choices?.[0]?.message?.content) {
          console.log(JSON.stringify(generatedDescription, null, 2));
          image.desc = generatedDescription.choices[0].message.content; // 更新描述
          console.log(`Description generated: ${image.desc}`);
        } else {
          console.warn(`No valid content generated for image: ${image.url}`);
        }
      } catch (error) {
        console.error(`Error generating description for image: ${image.url}`, error);
      }
    }
  }
}

// 更新 MongoDB 中的新聞詳細內容
async function updateEYnewsContent() {
  try {
    // 查找需要更新的新聞項目
    const newsItems = await EYnewsModel.find({
      $or: [
        { content: { $exists: false } }, // 沒有文章內容
        { 'images.desc': { $exists: false } }, // 有圖片但缺少描述
        { 'images.desc': '' } // 有描述但為空
      ]
    });

    console.log(`Found ${newsItems.length} news items to update.`);

    for (const newsItem of newsItems) {
      console.log(`Fetching content for: ${newsItem.title}`);
      let contentData = null;

      // 如果缺少內容，抓取新的內容
      if (!newsItem.content) {
        contentData = await fetchNewsContent(newsItem.link);
        if (contentData) {
          newsItem.content = contentData.content; // 更新文章內容
          newsItem.images = contentData.images; // 更新圖片陣列
        } else {
          console.warn(`Failed to fetch content for: ${newsItem.title}`);
          continue; // 如果無法抓取內容，跳過此新聞項目
        }
      }

      // 更新圖片描述
      await updateImageDescriptions(newsItem.images);

      // 儲存更新結果
      await newsItem.save();
      console.log(`Updated content for: ${newsItem.title}`);
    }

    console.log('All news items have been processed.');
  } catch (error) {
    console.error('Error updating news content:', error);
  }
}

export default updateEYnewsContent;
