import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/pages/Home/Home'
import Projects from "./components/pages/Projects/Projects";
import Company from './components/pages/Company/Company'
import Contact from './components/pages/Contact/Contact'
import NewProject from './components/pages/NewProject/NewProject'

import Project from "./components/pages/Project/Project";
import Container from './components/layouts/Container/Container'
import  Navbar  from "./components/layouts/Navbar/Navbar";
import Footer from './components/layouts/Footer/Footer'

function App() {
  return (
    <Router>
      <Navbar/>
      <Container customClass="min-height">
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/projects" element={<Projects/>}/>
          <Route exact path="/company" element={<Company/>}/>
          <Route exact path="/contact" element={<Contact/>}/>
          <Route exact path="/newproject" element={<NewProject/>}/>
          <Route exact path="/projects/:id" element={<Project/>}/>
        </Routes>
      </Container>
      <Footer/>
    </Router>
  );
}

export default App;
