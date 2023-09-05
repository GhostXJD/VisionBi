import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import RegistroPage from './pages/RegistroPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/homePage';
import Profile from './pages/Profile';

import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<h1>Home Page</h1>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/registro' element={<RegistroPage />} />

        <Route element={<ProtectedRoute/>}>
          <Route path='/inicio' element={<HomePage />} />
          <Route path='/perfil' element={<Profile />} />
        </Route>
          <Route path='/csvDatos' element={<h1>Datos</h1>} />
          <Route path='/add-csv' element={<h1>Agregar Datos</h1>} />
          <Route path='/csvDatos/:id' element={<h1>Update Datos</h1>} />
          <Route path='/perfil' element={<h1>Perfil</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
