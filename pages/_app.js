import '../styles/globals.css'
import Head from 'next/head'

import * as fcl from "@onflow/fcl"

function MyApp({ Component, pageProps }) {

  fcl.config({
    "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
    "app.detail.title": "Raft",
    "app.detail.icon": "https://avatars.onflow.org/avatar/raft"
  })


  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" rel="stylesheet"/>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
