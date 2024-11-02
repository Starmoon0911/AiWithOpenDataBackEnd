import mongoose, { Schema, Document } from 'mongoose'
interface EYnews extends Document {
    title: string,
    date: Date
    description?: string,
    link: string
}

const EYnewsSchema: Schema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: false },
    link: { type: String, required: true }
})

const EYnewsModel = mongoose.model('EYnews', EYnewsSchema);
export { EYnews };
export default EYnewsModel;