import { AppState } from '@/store/store'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Pagination } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Paginate = () => {
  const { pagesCount, page } = useSelector((state: AppState) => state.products)
  const router = useRouter()
  const keyword = router.query.keyword

  const paginationHandler = (x: number) => {
    router.push(
      `${router.pathname}${
        keyword ? `/?keyword=${keyword}&page=${x + 1}` : `/?page=${x + 1}`
      }`
    )
  }

  if (pagesCount < 2) return null

  return (
    <Pagination>
      {Array.from({ length: pagesCount }, (_, i) => (
        <Pagination.Item
          onClick={() => paginationHandler(i)}
          key={i + 1}
          active={i + 1 === page}
        >
          {i + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  )
}

export default Paginate
