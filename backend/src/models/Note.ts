import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    tasK: Types.ObjectId
}

const NoteSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    task: {
        type: Types.ObjectId,
        ref: "Task"
    }
}, {timestamps: true})

const Note = mongoose.model<INote>("Note", NoteSchema)

export default Note