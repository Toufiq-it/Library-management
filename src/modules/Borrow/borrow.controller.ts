import express, { Request, Response } from "express";
import { Borrow } from "./borrow.model";
import { Books } from "../Books/books.model";

export const borrowRouters = express.Router();


// Create Borrow
borrowRouters.post('/', async (req: Request, res: Response) => {
    try {
        const { book: bookId, quantity, dueDate } = req.body;

        // Find book
        const book = await Books.findById(bookId);
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
        await book.save();

        // Create borrow 
        const borrow = await Borrow.create({
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
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
            error
        });
    }
});

// BorrowSummary
borrowRouters.get('/', async (req: Request, res: Response) => {
    try {
        const summary = await Borrow.aggregate([
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
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
            error
        });
    }
}) 