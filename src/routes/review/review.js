const express = require('express');
const app = express();
const Review = require('../../models/Review/review');
const Book = require('../../models/Books/books');
const {userAuth} = require('../../middleware/auth'); 
const logger = require('../../utils/logger');

app.post('/books/:bookId/reviews', userAuth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { bookId } = req.params;


        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ status: false, message: 'Book not found.' });
        }

        const review = new Review({
            book: bookId,
            user: req.user._id,
            rating,
            comment,
        });

        const newReview = await review.save();

        book.reviews.push(newReview._id);
        await book.save();

        logger.info(`Review added by user ${req.user.email} to book ${book.title}`);
        return res.status(201).json({ status: true, data: newReview });
    } catch (error) {
        logger.error(`Error adding review: ${error.message}`);
        res.status(500).json({ status: false, message: 'Server Error' });
    }
});

module.exports = app;
