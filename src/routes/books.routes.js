import express from 'express'
import { Book } from '../models/book.model.js'
const router = express.Router()

// Middleware
const getBook = async (req, res, next) => {
  let book
  const { id } = req.params

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ message: 'Id no válido' })
  }

  try {
    book = await Book.findById(id)
    if (!book) return res.status(404).json({ message: 'No se encuentra el libro' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

  res.book = book
  next()
}

//  Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find()
    console.log('get all', books)

    if (!books || books.length === 0) return res.status(404).json({ message: 'No hay libros' })
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Obtener libro por id
router.get('/:id', getBook, (req, res) => {
  res.json(res.book)
})

// Actualizar TODOS los campos del libro
router.put('/:id', getBook, async (req, res) => {
  try {
    const book = res.book

    // Actualizar todos los campos enviados en el body
    Object.assign(book, req.body)
    const updatedBook = await book.save()
    res.json(updatedBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Actualizar solo ALGUNOS campos del libro
router.patch('/:id', getBook, async (req, res) => {
  try {
    const book = res.book
    const updates = req.body

    // Crear un objeto con los campos válidos presentes en `req.body`
    const validUpdates = Object.keys(updates)
      .filter(field => ['title', 'author', 'genre', 'publicationDate', 'language'].includes(field))
      .reduce((obj, field) => {
        obj[field] = updates[field]
        return obj
      }, {})

    // Verificar al menos un campo válido
    if (Object.keys(validUpdates).length === 0) {
      return res.status(400).json({
        message: 'Se debe proporcionar al menos un campo válido para actualizar.'
      })
    }

    // Actualizar los campos válidos en el objeto `book`
    Object.assign(book, validUpdates)
    const updatedBook = await book.save()
    res.json(updatedBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Crear un nuevo libro
router.post('/', async (req, res) => {
  const { title, author, genre, publicationDate, language } = req.body
  if (!title || !author || !genre || !publicationDate || !language) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' })
  }
  const book1 = new Book({ title, author, genre, publicationDate, language })

  try {
    const newBook = await book1.save()
    res.status(201).json(newBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Eliminar un libro
router.delete('/:id', getBook, async (req, res) => {
  const book = res.book
  try {
    await Book.deleteOne({ _id: book._id })
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el libro: ' + error.message })
  }
})

export default router
