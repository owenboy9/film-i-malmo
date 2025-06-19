import logo from './logo.svg';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import TestSupabase from './TestSupabase';
import Header from './components/Header';
import Footer from './components/Footer';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/contact" element={ <Contact /> } />
          <Route path="/about" element={ <About /> } />
          <Route path="/test" element={<TestSupabase />} />
          <Route path="/testdb" element={<TestDb />} />
        </Routes>
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
