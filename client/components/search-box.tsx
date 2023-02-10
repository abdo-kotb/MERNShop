import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()
  const page = router.query.page

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()

    if (keyword.trim()) {
      router.push(
        page ? `/?keyword=${keyword}&page=${page}` : `/?keyword=${keyword}`
      )
    } else {
      router.push('/')
    }
  }
  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col sm={9}>
          <Form.Control
            type="text"
            name="q"
            onChange={e => setKeyword(e.target.value)}
            placeholder="search products..."
          />
        </Col>
        <Col sm={3}>
          <Button type="submit" variant="outline-success">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchBox
