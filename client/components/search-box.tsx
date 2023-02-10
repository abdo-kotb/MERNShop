import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()

    if (keyword.trim()) {
      router.push(`/search/${keyword}`)
    } else {
      router.push('/')
    }
  }
  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col sm={8}>
          <Form.Control
            type="text"
            name="q"
            onChange={e => setKeyword(e.target.value)}
            placeholder="search products..."
          />
        </Col>
        <Col sm={4}>
          <Button type="submit" variant="outline-success">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchBox
