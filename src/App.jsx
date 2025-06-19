import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import TestDb from './pages/TestDb';
import TestSupabase from './TestSupabase';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Schedule from './pages/Schedule';
import Currentboard from './pages/CurrentBoard';
import Freescreen from './pages/Freescreen';
import Press from './pages/Press';
import Hypnos from './pages/Hypnos';
import AnnualMeeting from './pages/AnnualMeeting';
import Volunteering from './pages/Volunteering';
import More from './pages/More';
import MemberInfo from './pages/MemberInfo';
import PastEvents from './pages/PastEvents';
import CurrentPastProjects from './pages/CurrentPastProjects';
import Header from './components/Header';
import Footer from './components/Footer';

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
      <Header />
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
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
