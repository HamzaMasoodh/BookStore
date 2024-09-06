const express = require('express');
const app = express()
const Book = require('../../models/Books/books');
const {adminAuth} = require('../../middleware/auth');
const logger = require('../../utils/logger');
const Review = require('../../models/Review/review');

app.post('/books', adminAuth, async (req, res) => {
    try {
        const { title, author, description, price, stock } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({ status: false, message: 'Title, author, and price are required.' });
        }

        const book = new Book({
            title,
            author,
            description,
            price,
            stock,
        });

        const newBook = await book.save();
        logger.info(`Book created: ${newBook.title}`);
        res.status(201).json({ status: true, data: newBook });
    } catch (error) {
        logger.error(`Error creating book: ${error.message}`);
        res.status(500).json({ status: false, message: 'Server Error' });
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find().populate('reviews');
        res.status(200).json({ status: true, data: books });
    } catch (error) {
        logger.error(`Error fetching books: ${error.message}`);
        res.status(500).json({ status: false, message: 'Server Error' });
    }
});


module.exports = app;
