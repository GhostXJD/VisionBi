import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './ProtectedRoute'
// Rutas Publicas
import PresentacionPage from './pages/PresentacionPage'
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
// Rutas usuarios logueados
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
// Rutas admin
import ListarUsuariosPage from './pages/ListarUsuariosPage';
// Rutas representante
import RegistroEmpleadoPage from './pages/RegistroEmpleadoPage';
import ListarEmpleadosPage from './pages/ListarEmpleadosPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider> 
        <BrowserRouter>
          
          <main className='container mx-auto px-1'>
            <Routes>
              {/* Rutas publicas */}
              <Route path='/' element={<PresentacionPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/registro' element={<RegistroPage />} />

              {/* Rutas usuarios logueados */}
              <Route element={<ProtectedRoute />}>
                <Route path='/inicio' element={<HomePage />} />
                <Route path='/perfil' element={<Profile />} />
              </Route>

            {/* Rutas Admin */}
            <Route element={<ProtectedRoute role='admin'/>}>
              <Route path='/ListarUsuarios' element={<ListarUsuariosPage />} />
            </Route>

            {/* Rutas Representante */}
            <Route element={<ProtectedRoute role='representante'/>}>
              <Route path='/RegistrarEmpleado' element={<RegistroEmpleadoPage />} />
              <Route path='ListarEmpleados' element={<ListarEmpleadosPage />} />
            </Route>

            <Route path='/csvDatos' element={<h1>Datos</h1>} />
            <Route path='/add-csv' element={<h1>Agregar Datos</h1>} />
            <Route path='/csvDatos/:id' element={<h1>Update Datos</h1>} />
          </Routes>
        </main>
      </BrowserRouter>
      </ThemeProvider> 
    </AuthProvider>
  )
}

export default App