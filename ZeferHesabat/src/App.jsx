import React from 'react';
import Login from "./pages/Login/Login";
import Kafedra from './pages/Kafedra/Kafedra';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dekan" element={<Kafedra />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;