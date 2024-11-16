import axios from 'axios';
import * as cheerio from 'cheerio';
import EYnewsModel, { EYnews } from '../../database/schemas/EYnews';
interface NewsItem {
  title: string;
  date: Date;
  description: string;
  link: string;
}

function convertROCDateToADDate(rocDate: string): Date {
  const [rocYear, month, day] = rocDate.split('-').map(Number);
  const adYear = rocYear + 1911;
  return new Date(adYear, month - 1, day);
}

async function fetchEYNews(): Promise<NewsItem[]> {
  try {
    const url = 'https://www.ey.gov.tw/Page/6485009ABEC1CB9C';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const newsItems: NewsItem[] = [];
    console.log('start to fetch news items')
    $('.grid.effect.list-group-item > li').each((_, element) => {
      const title = $(element).find('.title').text().trim();
      const date = convertROCDateToADDate($(element).find('.date').text().trim());
      const description = $(element).find('p').text().trim();
      const link = $(element).find('a').attr('href')?.trim();

      if (link) {
        newsItems.push({
          title,
          date,
          description,
          link: `https://www.ey.gov.tw${link}`,
        });
      }
    });

    for (const newsItem of newsItems) {
      const exists = await EYnewsModel.findOne({ title: newsItem.title });
      console.log(newsItem)
      if (exists) {
        // If we find a duplicate, stop processing further items
        break;
      }
      const news = new EYnewsModel(newsItem);
      await news.save();
    }

    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default fetchEYNews;
