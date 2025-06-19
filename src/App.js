import logo from './logo.svg';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home'
import Contact from './pages/contact'
import About from './pages/about';
import TestSupabase from './TestSupabase'
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
          <Route path="/" element={ <Home /> } />
          <Route path="/schedule" element={ <Schedule /> } />
          <Route path="/contact" element={ <Contact /> } />
          <Route path="/about" element={ <About /> } />
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
