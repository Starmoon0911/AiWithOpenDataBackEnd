import { Schema } from "mongoose";
import mongoose from "mongoose";
const EYImages = new Schema({
    tagetID: { type: String, required: true },
    imageURL: { type: String, required: true },
    desc: { type: String, required: true }
})

const EYImagesSchema = mongoose.model("EYImages", EYImages)

export default EYImagesSchema;