import '../styles/globals.css'

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'

import * as fcl from "@onflow/fcl"

import { HighlighterContext } from "../src/context"

import {createStarryNight} from '@wooorm/starry-night'
import sourceCadence from '@wooorm/starry-night/lang/source.cadence.js'

function MyApp({ Component, pageProps }) {

  fcl.config({
    "app.detail.title": "Raft",
    "app.detail.icon": "https://avatars.onflow.org/avatar/raft"
  })

  const [highlighter, setHighlighter] = useState()
  const initHighlighter = async () => {
    if (!highlighter) {
      const starryNight = await createStarryNight([sourceCadence])
      setHighlighter(starryNight)
    }
  }
  initHighlighter()

  const router = useRouter()

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" rel="stylesheet"/>

        {/* https://github.com/sindresorhus/github-markdown-css */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-light.css" integrity="sha512-1d9gwwC3dNW3O+lGwY8zTQrh08a41Ejci46DdzY1aQbqi/7Qr8Asp4ycWPsoD52tKXKrgu8h/lSpig1aAkvlMw==" crossorigin="anonymous" referrerpolicy="no-referrer" />

        <link rel="stylesheet" href="https://esm.sh/@wooorm/starry-night@1/style/light.css"/>
      </Head>

      <HighlighterContext.Provider value={highlighter}>

        <Component key={router.asPath} {...pageProps} />

      </HighlighterContext.Provider>
    </>
  )
}

export default MyApp
