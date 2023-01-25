import Footer from '@/components/footer'
import Header from '@/components/header'
import '@/styles/globals.css'
import '@/styles/bootstrap.min.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export default function App({ Component, pageProps }: AppProps) {
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
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
