import logo from './logo.svg';
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/home'
import Contact from './pages/contact'
import About from './pages/about';
import TestDb from './pages/testdb';
import TestSupabase from './TestSupabase';
import ResetPasswordPage from './pages/ResetPasswordPage';
import BuyMembership from './pages/BuyMembership';
import Payment from './pages/Payment';
import MembershipConfirmation from './pages/MembershipConfirmation';

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
          <Route path="/testdb" element={ <TestDb /> } />
          <Route path="/test" element={<TestSupabase />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/buy-membership" element={<BuyMembership />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/membership-confirmation" element={<MembershipConfirmation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
