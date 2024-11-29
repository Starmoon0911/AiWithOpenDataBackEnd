import cron from 'node-cron';
import fetchEYNews from '../actions/EY/getNews';
import updateEYnewsContent from '../actions/EY/getNewscontent';
cron.schedule('0 17 * * *', () => {    
    console.log('Starting to fetch EY news...');
    fetchEYNews();
    console.log('Finished fetching EY news.');
    console.log('Starting to update EY news content...');
    updateEYnewsContent();
    console.log('Finished updating EY news content.');
}, {
    scheduled: true,
    timezone: "Asia/Taipei"  // 設定為台灣時區
});
