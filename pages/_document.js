import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head />
            <title>Age of Eykar</title>

            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
            <meta name="theme-color" content="#282828" />
            <meta property="og:site_name" content="A decentralizied strategy game" />
            <meta property="og:title" content="Age of Eykar ⚔️" />
            <meta property="og:type" content="website" />
            <meta property="og:description" content="An infinite, unpredictable world driven by a decentralized smartcontract. Expand your empire and conquer the world." />
            <meta property="og:url" content="https://eykar.org" />
            <meta property="og:image" content="/logo.svg" />
            <meta name="description" content="An infinite, unpredictable world driven by a decentralized smartcontract" />

            <link rel="icon" href="/favicon.ico" />

            <body className="default_background_color">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}