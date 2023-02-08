import express from 'express'
import {
  deleteProduct,
  getProductById,
  getProducts,
} from '../controllers/productController.js'
import { isAdmin, protect } from '../middelwares/authMiddleware.js'

const router = express.Router()

router.route('/').get(getProducts)

router.route('/:id').get(getProductById).delete(protect, isAdmin, deleteProduct)

export default router
