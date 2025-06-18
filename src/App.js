import logo from './logo.svg';
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/home'
import Contact from './pages/contact'
import About from './pages/about';
import TestSupabase from './TestSupabase'
import ResetPasswordPage from './pages/ResetPasswordPage'

function HashRedirector() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const type = params.get('type');
      if (type === 'recovery') {
        navigate('/reset-password' + window.location.hash, { replace: true });
      }
      // else: do nothing, let the user go to home or handle confirmation
    }
  }, [navigate]);
  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><HashRedirector /><Home /></>} />
          <Route path="/contact" element={ <Contact /> } />
          <Route path="/about" element={ <About /> } />
          <Route path="/test" element={<TestSupabase />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
