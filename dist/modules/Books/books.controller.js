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
exports.booksRouters = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("./books.model");
exports.booksRouters = express_1.default.Router();
// create books
exports.booksRouters.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield books_model_1.Books.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book Created successfuly",
            data
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
// Get All Books
exports.booksRouters.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genre = req.query.genre;
        const sortField = 'createdAt';
        const sortOrder = req.query.createdAt === 'desc' ? -1 : 1;
        const limit = parseInt(req.query.limit) || 10;
        // filter
        const filter = {};
        if (genre) {
            filter.genre = genre;
        }
        const books = yield books_model_1.Books.find(filter).sort({ [sortField]: sortOrder }).limit(limit).lean();
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
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
// Get single Book
exports.booksRouters.get('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const data = yield books_model_1.Books.findById(bookId);
        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data
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
// Update book
exports.booksRouters.put('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookBody = req.body;
        const bookId = req.params.bookId;
        const data = yield books_model_1.Books.findByIdAndUpdate(bookId, bookBody, { new: true });
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data
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
// Delete Book
exports.booksRouters.delete('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const data = yield books_model_1.Books.findByIdAndDelete(bookId, { new: true });
        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data
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
