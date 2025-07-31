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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRouters = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("./borrow.model");
const books_model_1 = require("../Books/books.model");
exports.borrowRouters = express_1.default.Router();
// Create Borrow
exports.borrowRouters.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        // Find book
        const book = yield books_model_1.Books.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        // Check availability
        if (book.copies < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough copies available',
            });
        }
        // Deduct copies 
        book.deductCopies(quantity);
        // Save updated book
        yield book.save();
        // Create borrow 
        const borrow = yield borrow_model_1.Borrow.create({
            book: book._id,
            quantity,
            dueDate,
        });
        // res message
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                success: false,
                message: error.message,
                error
            });
        }
    }
}));
// BorrowSummary
exports.borrowRouters.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
            // pipeline-1
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            // pipeline-2
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookInfo',
                },
            },
            // pipeline-3
            {
                $unwind: '$bookInfo',
            },
            // pipeline-4
            {
                $project: {
                    _id: 0,
                    totalQuantity: 1,
                    book: {
                        title: '$bookInfo.title',
                        isbn: '$bookInfo.isbn',
                    },
                },
            },
        ]);
        //res message
        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                success: false,
                message: error.message,
                error
            });
        }
    }
}));
//
