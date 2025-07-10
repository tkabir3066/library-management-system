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
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
exports.booksRoutes = express_1.default.Router();
// create book
exports.booksRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const book = yield book_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
// get all books
exports.booksRoutes.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit = "10", page = "1", } = req.query;
        // console.log('sort', sort);
        // console.log('sortBy', sortBy);
        // console.log(filter);
        const query = {};
        if (filter) {
            query.genre = filter;
            // console.log('query', query);
            // console.log('filter', filter);
        }
        const sortOrder = sort === "desc" ? -1 : 1;
        // const books = await Book.find({ genre: filter })
        /*  const books = await Book.find(query)
               .sort({ [sortBy as string]: sortOrder })
               .limit((Number(limit)))
   
           res.status(201).json({
               success: true,
               message: 'Books retrieved successfully',
               data: books
           }) */
        // pagination logic
        const skip = (Number(page) - 1) * Number(limit);
        const [books, total] = yield Promise.all([
            book_model_1.Book.find(query)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(Number(limit)),
            book_model_1.Book.countDocuments(query),
        ]);
        res.status(200).json({
            success: true,
            data: books,
            message: "Books retrieved successfully",
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        next(error);
    }
}));
// get book by id
exports.booksRoutes.get("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            res.status(400).json({
                success: false,
                message: "Book not found",
                data: null,
            });
        }
        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
// updating book
exports.booksRoutes.patch("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBook = req.body;
        const book = yield book_model_1.Book.findByIdAndUpdate(bookId, updatedBook, {
            new: true,
            runValidators: true,
        });
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
// Deleting Book
exports.booksRoutes.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const deleteBook = yield book_model_1.Book.findByIdAndDelete(bookId);
        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
}));
// global error handler (last e)
exports.booksRoutes.use((error, req, res, next) => {
    if (error.name === "ValidationError") {
        // return console.log('error', error);
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
            },
        });
    }
    // other errors
    res.status(400).json({
        message: error.message || "Something went wrong",
        success: false,
        error,
    });
});
