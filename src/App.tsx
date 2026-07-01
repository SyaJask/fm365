import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

import './App.css'
import './components/ExplorerWindow/ExplorerWindow.css'
import { ExplorerWindow } from './components/ExplorerWindow'
import { TitleBar } from './components/TitleBar'
import type { Tab } from './types'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <ExplorerWindow></ExplorerWindow>
    </>
  )
}

export default App
