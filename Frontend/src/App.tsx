import './App.css'

import 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductCreate from './pages/create/ProductCreate';
import ProductEdit from './pages/edit/ProductEdit';

function App() {
    return (
        <BrowserRouter>
            <Routes>ProductList
                <Route path="/" element={<ProductList/>} />
                <Route path='/Product/Create' element={<ProductCreate/>} />
                <Route path='/Product/Edit/:id' element={<ProductEdit/>} />
                
            </Routes>
        </BrowserRouter>
    )
}

export default App