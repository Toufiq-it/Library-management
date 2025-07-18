import express, { Request, Response } from "express";
import { Books } from "./books.model";

export const booksRouters = express.Router();


// create books
booksRouters.post('/', async (req: Request, res: Response) => {
    try {
        const data = await Books.create(req.body)

        res.status(201).json({
            success: true,
            message: "Book Created successfuly",
            data
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
            error
        });
    }
});

// Get All Books
booksRouters.get('/', async (req: Request, res: Response) => {
    try {
        const genre = req.query.genre;
        const sortField = 'createdAt';
        const sortOrder = req.query.createdAt === 'desc' ? -1 : 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // filter
        const filter: any = {};
        if (genre) {
            filter.genre = genre;
        }

        const books = await Books.find(filter)
            .sort({ [sortField]: sortOrder })
            .limit(limit);

        res.status(201).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
            error
        });
    }
});

// Get single Book
booksRouters.get('/:bookId', async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        const data = await Books.findById(bookId);

        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
            error
        });
    }
});

// Update book
booksRouters.put('/:bookId', async (req: Request, res: Response) => {
    try {
        const bookBody = req.body;
        const bookId = req.params.bookId;
        const data = await Books.findByIdAndUpdate(bookId, bookBody, { new: true });

        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
            error
        });
    }
});

// Delete Book
booksRouters.delete('/:bookId', async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        const data = await Books.findByIdAndDelete(bookId, { new: true });

        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
            error
        });
    }
});