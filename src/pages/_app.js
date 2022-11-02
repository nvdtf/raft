import Script from 'next/script'

import '../../styles/globals.css'

import * as fcl from "@onflow/fcl"

import HighlighterProvider from "../context/HighlighterProvider"

function MyApp({ Component, pageProps }) {

  fcl.config({
    "app.detail.title": "Raft",
    "app.detail.icon": "https://avatars.onflow.org/avatar/raft"
  })

  return (
    <>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V44B3NZN1L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-V44B3NZN1L');
          `}
        </Script>

      <HighlighterProvider>
        <Component {...pageProps} />
      </HighlighterProvider>

    </>
  )
}

export default MyApp
