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
import Moderator from './pages/moderator.jsx'
import User from './pages/user.jsx'
import { Toaster } from 'react-hot-toast'
import Createticket from './pages/createticket.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true }}>
     <Toaster position="top-center" reverseOrder={false} /> {/* For adding toast notifications.*/}
      <Routes>
        <Route path='/' element={
          <CheckAuth protectedRoute={true}>
            <Tickets />
          </CheckAuth>
        }
        />

        <Route path='/ticket/:id' element={
          <CheckAuth protectedRoute={true}>
            <TicketDetailPage />
          </CheckAuth>
        }
        />
        <Route path='/moderator' element={
          <CheckAuth protectedRoute={true}>
            <Moderator />
          </CheckAuth>
        }/>

        <Route path='/user' element={
          <CheckAuth protectedRoute={true}>
            <User />
          </CheckAuth>
        }/>

        <Route path='/login' element={
          <CheckAuth protectedRoute={false}>
          <Login />
          </CheckAuth>
          }
           />

            <Route path='/create-ticket' element={
          <CheckAuth protectedRoute={true}>
          <Createticket />
          </CheckAuth>
          }
           />

          <Route path='/signup' element={
            <CheckAuth protectedRoute={false}>
              <Signup />
            </CheckAuth>
          }
          /> 

        <Route path='/admin' element={
            <CheckAuth protectedRoute={true}>
              <Admin />
            </CheckAuth>
          }
          />   
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
