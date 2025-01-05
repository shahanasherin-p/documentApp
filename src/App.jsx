import {  Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Editor from './Editor';



function App() {

  return (
    <>
      <Routes>
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
