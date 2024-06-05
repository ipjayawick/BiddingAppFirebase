import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/LoginPage/App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BiddingPage from './pages/biddingPage/biddingPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/biddingPage',
    element: <BiddingPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
