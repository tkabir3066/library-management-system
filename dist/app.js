"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./app/controllers/book.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const cors_1 = __importDefault(require("cors"));
// npm i --save-dev @types/cors
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/books", book_controller_1.booksRoutes);
app.use("/api/borrow", borrow_controller_1.borrowRoutes);
app.get("/", (req, res) => {
    res.send("Welcome from Library Management System");
});
// 404 error
app.use((req, res) => {
    res.status(404).json({ message: "Sorry! Route not found" });
});
exports.default = app;
