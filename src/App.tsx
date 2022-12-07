import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import QgisQuery from './QgisQuery'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <QgisQuery />
    </div>
  )
}

export default App
