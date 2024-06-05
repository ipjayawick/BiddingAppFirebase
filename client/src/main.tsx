import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/LoginPage/App.tsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BiddingPage from './pages/biddingPage/biddingPage.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />
  },
  {
    path: '/biddingPage',
    element: <BiddingPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>,
)
