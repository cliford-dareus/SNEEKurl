import { useState } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
 
function App() {
  return (
    <div className="w-full h-screen bg-black flex flex-col justify-center items-center">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;
