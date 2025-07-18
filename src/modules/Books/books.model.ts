import { model, Schema } from "mongoose";
import { IBooks } from "./books.interface";

export const booksSchema = new Schema<IBooks>({
    title: { 
        type: String, 
        trim: true, 
        required: [true, 'Title is not valid']
     },
    author: { 
        type: String, 
        required: [true, 'Author is not valid']
     },
    genre: {
        type: String,
        enum: {
            values:["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
            message: "Book is not Valid. got {VALUE} Book"
        },
        required: [true, 'Genre is not valid']
    },
    isbn: { 
        type: String, 
        required: [true, 'ISBN is not valid'], 
        unique: [ true, "This ISBN is Already Exist"]
     },
    description: { 
        type: String, 
        default: "", 
        trim: true
     },
    copies: { 
        type: Number, 
        required: true,
        min: [0, "Copies must be a positive number"],
        validate: {
            validator: Number.isInteger,
            message: 'Copies must be an integer'
        }
     },
    available: {
        type: Boolean,
        default: true
    }
},{
    versionKey: false,
    timestamps: true
});

// Instence Methods
booksSchema.methods.deductCopies = function (quantity: number) {
  if (this.copies < quantity) {
    throw new Error('Not enough copies available');
  }
  this.copies -= quantity;
  if (this.copies === 0) {
    this.available = false;
  }
};

export const Books = model<IBooks>('Books', booksSchema);