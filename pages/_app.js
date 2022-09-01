import '../styles/globals.css'

import * as fcl from "@onflow/fcl"

import HighlighterProvider from "../src/context/HighlighterProvider"

function MyApp({ Component, pageProps }) {

  fcl.config({
    "app.detail.title": "Raft",
    "app.detail.icon": "https://avatars.onflow.org/avatar/raft"
  })

  return (
    <>

      <HighlighterProvider>
        <Component {...pageProps} />
      </HighlighterProvider>

    </>
  )
}

export default MyApp
