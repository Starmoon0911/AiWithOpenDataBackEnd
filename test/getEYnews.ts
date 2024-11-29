import updateEYnewsContent from "../src/actions/EY/getNewscontent";
import fetchEYNews from "../src/actions/EY/getNews";
import connectDatabase from "../src/database/mongodb";
async function run(){
    connectDatabase()
    await fetchEYNews()
    await updateEYnewsContent()
}
run()