import { getAllProducts } from '@/store/actions/product-actions'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import { wrapper } from '@/store/store'
import { AnyAction } from '@reduxjs/toolkit'
import React from 'react'
import Home from '..'

const Search = () => {
  return <Home />
}

export default Search

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req, query }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))

      await store.dispatch(
        getAllProducts(query.keyword as string) as unknown as AnyAction
      )
      return { props: {} }
    }
)
