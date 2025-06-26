// pages/_app.js

import '../styles/globals.css' // Optional: Only if you have a global stylesheet
import { GameProvider } from '../context/GameContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  )
}
