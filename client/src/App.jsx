import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import roles from './helpers/roles';

import PresentacionPage from './pages/PresentacionPage'
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import RegistroUsuarioPage from './pages/RegistroUsuarioPage'
import ListarUsuariosPage from './pages/ListarUsuariosPage';

import ProtectedRoute from './ProtectedRoute'
import Navbar from './components/navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main className='container mx-auto px-1'>
          <Navbar />
          <Routes>
            <Route path='/' element={<PresentacionPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/registro' element={<RegistroPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path='/inicio' element={<HomePage />} />
              <Route path='/perfil' element={<Profile />} />
            </Route>

        /*TODO: Falta agregar el hasRole que lo hare mas adelante*/
            <Route element={<ProtectedRoute />}>
              <Route path='/RegistrarUsuario' element={<RegistroUsuarioPage />} />
              <Route path='/ListarUsuarios' element={<ListarUsuariosPage />} />
            </Route>

            <Route path='/csvDatos' element={<h1>Datos</h1>} />
            <Route path='/add-csv' element={<h1>Agregar Datos</h1>} />
            <Route path='/csvDatos/:id' element={<h1>Update Datos</h1>} />
            <Route path='/perfil' element={<h1>Perfil</h1>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
