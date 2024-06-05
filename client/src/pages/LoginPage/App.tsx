import { useState } from 'react'
import GoogleSignIn from '../../google-auth/GoogleSignIn.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Bidding App</h1>
          <GoogleSignIn />
        </header>
      </div>
    </>
  )
}

export default App
