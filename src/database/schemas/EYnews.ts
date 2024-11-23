import mongoose, { Schema, Document } from 'mongoose';

// 定義接口（Interface）
interface Image {
  url: string;
  desc?: string; // 描述為選填
}

interface EYnews extends Document {
  title: string;
  date: Date;
  description?: string;
  link: string;
  images?: Image[]; // 儲存圖片物件陣列
  content?: string; // 單純儲存文章內容
}

// 定義 Schema
const EYnewsSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: false },
  link: { type: String, required: true },
  images: [
    {
      url: { type: String, required: true },
      desc: { type: String, required: false },
    },
  ], // 定義為物件陣列
  content: { type: String, required: false }, // 單純儲存內容
  agent: {
    title: { type: String, required: false },
    content: { type: String, required: false },
  },
});

// 定義 Model
const EYnewsModel = mongoose.model<EYnews>('EYnews', EYnewsSchema);

export { EYnews, Image };
export default EYnewsModel;
