import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Create a new Mongoose schema for storing video details
const videoSchema = new Schema(
  {
    // URL of the uploaded video (usually stored on Cloudinary)
    videoFile: {
      type: String,
      required: true
    },

    // URL of the video thumbnail image
    thumbnail: {
      type: String,
      required: true
    },

    // Title of the video
    title: {
      type: String,
      required: true
    },

    // Short description of the video
    description: {
      type: String,
      required: true
    },

    // Duration (length) of the video in seconds
    duration: {
      type: Number,
      required: true
    },

    // Number of views on the video (default = 0)
    views: {
      type: Number,
      default: 0
    },

    // Whether the video is published or not (default = true)
    isPublished: {
      type: Boolean,
      default: true
    },

    // The user who uploaded the video (linked to User model)
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }

  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true
  }
);

// Add pagination support for aggregation queries
videoSchema.plugin(mongooseAggregatePaginate);

// Create and export the Video model using the schema
export const Video = mongoose.model("Video", videoSchema);
