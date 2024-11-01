import app from './src/app';
import connectDatabase from './src/database/mongodb'
require('dotenv').config()
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server running at Port:${PORT}`);
    connectDatabase();
});