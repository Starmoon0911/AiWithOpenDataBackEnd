import mongoose, { Schema, Document } from 'mongoose';

// 定義接口（Interface）
interface EYnews extends Document {
    title: string;
    date: Date;
    description?: string;
    link: string;
    content?: {
        image: string[];
        content: string;
    };
}

// 定義 Schema
const EYnewsSchema: Schema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: false },
    link: { type: String, required: true },
    content: {
        type: {
            image: { type: [String], required: true },
            content: { type: String, required: true },
        },
        required: false, // 整個 content 是選填的
    },
});

// 定義 Model
const EYnewsModel = mongoose.model<EYnews>('EYnews', EYnewsSchema);

export { EYnews };
export default EYnewsModel;
