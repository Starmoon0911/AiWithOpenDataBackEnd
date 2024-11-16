import app from './src/app';
import connectDatabase from './src/database/mongodb'
import cors from 'cors'
import runCheck from './check';
app.use(cors)
require('dotenv').config()
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server running at Port:${PORT}`);
    runCheck()    
    connectDatabase();
});