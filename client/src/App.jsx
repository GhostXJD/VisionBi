import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CsvProvider } from './context/CsvContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './ProtectedRoute'
import Navbar from './components/Navbar'

// Rutas Publicas
import PresentacionPage from './pages/PresentacionPage'
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';

// Rutas usuarios logueados
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import ChangePasswordPage from './pages/ChangePasswordPage';

// Rutas admin
import ListarUsuariosPage from './pages/ListarUsuariosPage';

// Rutas representante
import RegistroEmpleadoPage from './pages/RegistroEmpleadoPage';
import ListarEmpleadosPage from './pages/ListarEmpleadosPage';

function App() {
  const hiddenRoutes = ['/login', '/registro']
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          {/* Contexto CSV */}
          <CsvProvider>
            <Navbar hiddenRoutes={hiddenRoutes}>
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
                    <Route path='/perfil/ChangePassword' element={<ChangePasswordPage />} />
                  </Route>

                  {/* Rutas Admin */}
                  <Route element={<ProtectedRoute role='admin' />}>
                    <Route path='/ListarUsuarios' element={<ListarUsuariosPage />} />
                  </Route>

                  {/* Rutas Representante */}
                  <Route element={<ProtectedRoute role='representante' />}>
                    <Route path='/RegistrarEmpleado' element={<RegistroEmpleadoPage />} />
                    <Route path='/ListarEmpleados' element={<ListarEmpleadosPage />} />
                  </Route>
                </Routes>
              </main>
            </Navbar>
          </CsvProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App