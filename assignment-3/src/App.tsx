import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Container } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"

function App () {
  let navigate = useNavigate();
  function handleClick() {
    navigate("/home");
}
  return (
    // <BrowserRouter>
    //   <Header />
    //   <main>
    //     <Container>
    //       <Route path='/' element={<HomePage/>} />
    //       <Route path='/signUp' component={SignUpPage} />
    //       <Route path='/login' component={LoginPage} />
    //     </Container>
    //   </main>
    //   <Footer />
    // </BrowserRouter>
    <div>
      <button onClick={handleClick}>go home</button>
    </div>
  )
}

export default App