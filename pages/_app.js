import '../styles/globals.css'

import { useRouter } from 'next/router';
import Head from 'next/head'

import * as fcl from "@onflow/fcl"

function MyApp({ Component, pageProps }) {

  fcl.config({
    "app.detail.title": "Raft",
    "app.detail.icon": "https://avatars.onflow.org/avatar/raft"
  })

  const router = useRouter()


  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" rel="stylesheet"/>
      </Head>
      <Component key={router.asPath} {...pageProps} />
    </>
  )
}

export default MyApp
