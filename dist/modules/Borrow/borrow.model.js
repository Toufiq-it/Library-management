"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = exports.borrowSchema = void 0;
const mongoose_1 = require("mongoose");
const books_model_1 = require("../Books/books.model");
exports.borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.borrowSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookExists = yield books_model_1.Books.findById(this.book);
        if (!bookExists) {
            return next(new Error('Book does not exist'));
        }
        next();
    });
});
// Post
exports.borrowSchema.post('save', function () {
    // console.log(`Borrow has been saved ${doc.book}`);
});
exports.Borrow = (0, mongoose_1.model)("Borrow", exports.borrowSchema);
