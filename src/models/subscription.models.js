import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema(
    {

        //how many user subscribe us
        subscriber : {
            type : Schema.Types.ObjectId, //one who subcribing
            ref: "User"
        },

        // how many channel subscribe by use
        channel : {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },

    {
        timestamps : true
    }

);

export const Subscription = mongoose.model("Subscription", subscriptionSchema)