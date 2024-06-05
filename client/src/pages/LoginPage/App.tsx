import { useState } from 'react'
import GoogleSignIn from '../../google-auth/GoogleSignIn.jsx'
import { AuthContextProvider } from '../../context/AuthContext.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthContextProvider>
      <div className="App">
        <header className="App-header">
          <h1>Bidding App</h1>
          <GoogleSignIn />
        </header>
      </div>
    </AuthContextProvider>
  )
}

export default App
