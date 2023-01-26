import express from 'express'
import products from './data/products.js'

const app = express()

app.get('/', (req, res) => {
  res.send('API running')
})

app.get('/api/products', (req, res) => {
  res.json(products)
})

app.get('/api/product/:id', (req, res) => {
  const {
    params: { id },
  } = req
  const product = products.find(product => product._id === id)
  res.json(product)
})

app.listen(5000, () => console.log('Server running on port 5000'))
