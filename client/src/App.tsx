import { useState } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import ProtectedRoutes from './components/protectedRoutes';
import Recent from './pages/recent';
import Favorite from './pages/favorite';
 
function App() {
  return (
    <div className="w-full h-screen overflow-hidden bg-black flex flex-col justify-center items-center">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>

          <Route element={<ProtectedRoutes />}>
            <Route path='/recent' element={<Recent />} />
            <Route path='/favorite' element={<Favorite />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;
