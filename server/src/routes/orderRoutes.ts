import express from 'express'
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToPaid,
} from '../controllers/orderController.js'
import { isAdmin, protect } from '../middelwares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addOrderItems).get(protect, isAdmin, getOrders)
router.route('/my-orders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)

export default router
