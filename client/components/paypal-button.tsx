import { payOrder } from '@/store/actions/order-actions'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { AnyAction } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useDispatch } from 'react-redux'
import Loader from './loader'

const PayPalButton: FC<{ totalPrice: number }> = ({ totalPrice }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [{ isPending }] = usePayPalScriptReducer()
  const orderId = router.query.id

  const successPaymentHandler = (paymentResult: any) => {
    dispatch(
      payOrder({
        orderId: orderId as string,
        paymentResult,
      }) as unknown as AnyAction
    )
  }

  if (isPending) return <Loader />

  return (
    <PayPalButtons
      createOrder={(_, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: { value: totalPrice.toString() },
            },
          ],
        })
      }}
      onApprove={async (_, actions) => {
        return actions.order!.capture().then(successPaymentHandler)
      }}
    />
  )
}

export default PayPalButton
