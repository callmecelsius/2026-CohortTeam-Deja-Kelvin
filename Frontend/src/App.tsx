import { useState } from 'react'

import './App.css'
import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button variant="outline">Click me</Button>
      </div>
    </>
  )
}

export default App
