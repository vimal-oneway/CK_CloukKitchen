import './App.css'

import {
  BrowserRouter, Routes, Route
} from 'react-router-dom'

import Products from './Components/Products'
import Home from './Components/home/Home'
import Nav from './Components/Nav'
import ProductFrom from './Components/ProductFrom'

function App() {

  // axios.get('http://localhost:3000/')
  return (
    <div className="app">
      {/* <Nav /> */}
      <BrowserRouter>
        <Routes>
          <Route>
            <Route index element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/product/add' element={<ProductFrom />} />
          </Route>
        </Routes >
      </BrowserRouter >
    </div>
  )
}

export default App
