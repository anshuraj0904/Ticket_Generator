import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CheckAuth from './components/check-auth.jsx'
import Login from './pages/login.jsx'
import Admin from "./pages/admin.jsx"
import Signup from './pages/signup.jsx'
import Tickets from './pages/tickets.jsx'
import TicketDetailPage from './pages/ticket.jsx'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <Toaster position="top-center" reverseOrder={false} /> {/* For adding toast notifications.*/}
      <Routes>
        <Route path='/' element={
          <CheckAuth protected={true}>
            <Tickets />
          </CheckAuth>
        }
        />

        <Route path='/tickets/:id' element={
          <CheckAuth protected={true}>
            <TicketDetailPage />
          </CheckAuth>
        }
        />

        <Route path='/login' element={
          <CheckAuth protected={false}>
          <Login />
          </CheckAuth>
          }
           />

          <Route path='/signup' element={
            <CheckAuth protected={false}>
              <Signup />
            </CheckAuth>
          }
          /> 

        <Route path='/admin' element={
            <CheckAuth protected={true}>
              <Admin />
            </CheckAuth>
          }
          />   
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
