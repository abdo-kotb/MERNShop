import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import { UserReq } from '../types.js'

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req: UserReq, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (!orderItems?.length) {
    res.status(400)
    throw new Error('No order items')
  }

  const order = new Order({
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
  })

  const createdOrder = await order.save()

  res.status(201).json(createdOrder)
})

export { addOrderItems }
