import logo from './logo.svg';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/home'
import Contact from './pages/contact'
import About from './pages/about';
import TestSupabase from './TestSupabase'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/contact" element={ <Contact /> } />
          <Route path="/about" element={ <About /> } />
          <Route path="/test" element={<TestSupabase />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
