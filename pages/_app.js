// pages/_app.js
import { GameProvider } from '../context/GameContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  )
}
