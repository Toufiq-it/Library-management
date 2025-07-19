import { model, Schema } from "mongoose";
import { IBorrow } from "./borrow.interface";
import { Books } from "../Books/books.model";


export const borrowSchema = new Schema<IBorrow>({
    book: {
        type: Schema.Types.ObjectId,
        ref: "Books",
        required: [true, "Book Id is not valid"]
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is not valid'],
        min: [1, 'Quantity must be at least 1'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer',
        }
    },
    dueDate: {
        type: Date,
        required: [true, 'DueDate date is not valid'],
    }
}, {
    versionKey: false,
    timestamps: true
});

// Pre
borrowSchema.pre('save', async function (next) {
  const bookExists = await Books.findById(this.book);
  if (!bookExists) {
    return next(new Error('Book does not exist'));
  }
  next();
});

// Post
borrowSchema.post('save', function () {
  // console.log(`Borrow has been saved ${doc.book}`);
});

export const Borrow = model<IBorrow>("Borrow", borrowSchema);