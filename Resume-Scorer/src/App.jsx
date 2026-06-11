import { useState } from 'react'
import './App.css'
import Navbar from './Component/Navbar'
import {Routes,Route} from 'react-router-dom'
import Dashboard from './Component/Dashboard'
import History from './Component/History'
import Admin from './Component/Admin'
import LogOut from './Component/LogOut'
import Login from './Component/Login'

function App() {
  return (
    <>
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/history' element={<History/>}></Route>
        <Route path='/admin' element={<Admin/>}></Route>
        <Route path='/logout' element={<LogOut/>}></Route>
      </Routes>
    </div>
    </>
  )
}

export default App


