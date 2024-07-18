import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        timestamps: true
    }
)

// 1.means that the mongooseAggregatePaginate plugin is being added to the videoSchema.

//2..plugin(): This is a method provided by Mongoose that allows you to add a plugin to a schema. 
//3.A plugin is a function that adds additional functionality to the schema it is applied to. 
//4.This can include adding new methods, pre/post hooks, or modifying the schema's configuration.

// By adding this plugin, it likely allows for easier handling of large sets
//  of aggregated data by breaking it down into smaller, more manageable pages.
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
