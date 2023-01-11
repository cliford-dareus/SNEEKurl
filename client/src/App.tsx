import { useState } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
 
function App() {
  return (
    <div className="w-full h-screen overflow-hidden bg-black flex flex-col justify-center items-center">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;
