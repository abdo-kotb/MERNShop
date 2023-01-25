import Head from 'next/head'
import Container from 'react-bootstrap/Container'

export default function Home() {
  return (
    <>
      <Head>
        <title>MERNShop</title>
        <meta
          name="description"
          content="ecommerce website with Next.js, TypeScript, Node.js, MongoDB"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="py-3">
        <Container>
          <h1>Welcome</h1>
        </Container>
      </main>
    </>
  )
}
