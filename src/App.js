import logo from './logo.svg';
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/home'
import Contact from './pages/contact'
import About from './pages/about';
import TestDb from './pages/testdb';
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
import Schedule from './pages/schedule';
import Currentboard from './pages/currentboard';
import Freescreen from './pages/freescreen';
import Press from './pages/press';
import Hypnos from './pages/hypnos';
import AnnualMeeting from './pages/annualmeeting';
import Volunteering from './pages/volunteering';
import More from './pages/more';
import MemberInfo from './pages/memberinfo';
import PastEvents from './pages/pastevents';
import CurrentPastProjects from './pages/currentpastprojects';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><HashRedirector /><Home /></>} />
          <Route path="/schedule" element={ <Schedule /> } />
          <Route path="/contact" element={ <Contact /> } />
          <Route path="/about" element={ <About /> } />
          <Route path="/testdb" element={ <TestDb /> } />
          <Route path="/currentboard" element={ <Currentboard /> } />
          <Route path="/press" element={ <Press /> } />
          <Route path="/hypnos" element={ <Hypnos /> } />
          <Route path="/annualmeeting" element={ <AnnualMeeting /> } />
          <Route path="/volunteering" element={ <Volunteering /> } />
          <Route path="/freescreen" element={ <Freescreen/> } />
          <Route path="/more" element={ <More /> } />
          <Route path="/pastevents" element={ <PastEvents /> } />
          <Route path="/currentpastprojects" element={ <CurrentPastProjects /> } />
          <Route path="/memberinfo" element={ <MemberInfo /> } />
          
          <Route path="/test" element={<TestSupabase />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
