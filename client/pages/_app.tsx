import Footer from '@/components/footer'
import Header from '@/components/header'
import '@/styles/globals.css'
import '@/styles/bootstrap.min.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
