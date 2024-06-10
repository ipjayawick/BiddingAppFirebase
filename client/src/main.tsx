import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BiddingPage from './pages/biddingPage/biddingPage.jsx'
import AdminPage from './pages/adminPage/AdminPage.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppBar from './components/AppBar.jsx'
import { CssBaseline } from '@mui/material'
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <LoginPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/biddingPage', 
    element: (
      <ProtectedRoute>
        <BiddingPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/adminPage',
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    )
  }

])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
    <CssBaseline />
      <AppBar />
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>,
)
