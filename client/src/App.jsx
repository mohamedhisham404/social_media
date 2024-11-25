// import { Button} from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'
import {Routes,Route} from 'react-router-dom'
import Userpage from './pages/UserPage'
import PostPage from './pages/PostPage'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import Header from './components/Header'

function App() {
  return (
    <Container maxW='620px'>
      <Header/>
      <Routes>
        <Route path='/' element={<HomePage/>}/> 
        <Route path='/auth' element={<AuthPage/>}/> 
        <Route path='/:username' element={<Userpage/>}/> 
        <Route path='/:username/post/:pid' element={<PostPage/>}/> 
      </Routes>
    </Container>
  )
}

export default App
