import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ChakraProvider } from '@chakra-ui/react';
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import Signin from './Signin'
import Menu from './menu'
import VideoUploadForm from './videoupload'
import VideoList from './videolist'
import VideoPlayer from './Videoplay'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BusinessmanHome from './BusinessmanHome';
import Businesslogin from './B_login';
import Businesssignup from './B_signup';
import Purchaseform from './Purchaseform';
import MyBills from './myBills'



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/videos" element={<VideoList />} />
        <Route path="/Signin" element={<Signin />}></Route>
        <Route path="/VideoUpload" element={<VideoUploadForm />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/menu" element={<Menu />}></Route>
        <Route path="/videos/:id" element={<VideoPlayer />} />
        <Route path="/BusinessmanHome" element={<BusinessmanHome />} />
        <Route path="/Busilogin" element={<Businesslogin />} />
        <Route path="/Busisignup" element={<Businesssignup />} />
        <Route path="/purchaseform" element={<Purchaseform />} />
        <Route path="/mybills" element={<MyBills/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
