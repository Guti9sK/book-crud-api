import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  publicationDate: String,
  language: String
})

export const Book = mongoose.model('Book', bookSchema)
