import mongoose, { Schema } from "mongoose";

const EYnewsContentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        require: true,
    },
    images: {
        type: [String]
    }
});


const EYnewsContentModel = mongoose.model('EYnewsContent', EYnewsContentSchema);
export default EYnewsContentModel;