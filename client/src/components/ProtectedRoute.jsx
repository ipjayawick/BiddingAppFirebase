import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/') {
      console.log(user, loading)
      if (user && !loading) {
        navigate('/biddingPage')
      } else {
        return
      }
    }
    if (!loading && !user) {
      console.log("redirecting")
      navigate('/', { replace: true });
    }

    if (!loading && !user?.isAdmin && window.location.pathname === '/adminPage') {
      navigate('/biddingPage')
    }

  }, [navigate, user, loading]);

  if (loading && !window.location.pathname === '/') {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;