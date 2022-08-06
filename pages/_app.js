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

        {/* https://github.com/sindresorhus/github-markdown-css */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-light.css" integrity="sha512-1d9gwwC3dNW3O+lGwY8zTQrh08a41Ejci46DdzY1aQbqi/7Qr8Asp4ycWPsoD52tKXKrgu8h/lSpig1aAkvlMw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
      <Component key={router.asPath} {...pageProps} />
    </>
  )
}

export default MyApp
