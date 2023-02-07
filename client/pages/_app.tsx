import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'

import { wrapper } from '@/store/store'

import '@/styles/globals.css'
import '@/styles/bootstrap.min.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { Container } from 'react-bootstrap'

import Footer from '@/components/footer'
import Header from '@/components/header'

export default function App({ Component, pageProps }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps)
  return (
    <>
      <Head>
        <meta
          name="description"
          content="ecommerce website with Next.js, TypeScript, Node.js, MongoDB"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider store={store}>
        <Header />
        <main className="py-3">
          <Container>
            <Component {...props.pageProps} />
          </Container>
        </main>
        <Footer />
      </Provider>
    </>
  )
}
