import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CsvProvider } from './context/CsvContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/footer';

// Rutas Publicas
import PresentacionPage from './pages/PresentacionPage'
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import AboutUs from './pages/AboutUs';
import Mission from './pages/Mission';
import Vision from './pages/Vision';
import ContactUs from './pages/ContactUs';

// Rutas usuarios logueados
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/DashboardPage';

// Rutas admin
import ListarUsuariosPage from './pages/ListarUsuariosPage';

// Rutas representante
import RegistroEmpleadoPage from './pages/RegistroEmpleadoPage';
import ListarEmpleadosPage from './pages/ListarEmpleadosPage';

function App() {
  const hiddenRoutes = ['/login', '/registro']
  const hiddenRoutesFooter = ['/login', '/registro','/inicio','/dashboard','/perfil','/perfil/ChangePassword','/ListarUsuarios','/RegistrarEmpleado','/ListarEmpleados']
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
                  <Route path='/aboutus' element={<AboutUs />} />
                  <Route path='/mission' element={<Mission />} />
                  <Route path='/vision' element={<Vision />} />
                  <Route path='/contactus' element={<ContactUs />} />

                  {/* Rutas usuarios logueados */}
                  <Route element={<ProtectedRoute />}>
                    <Route path='/inicio' element={<HomePage />} />
                    <Route path='/perfil' element={<Profile />} />
                    <Route path='/perfil/ChangePassword' element={<ChangePasswordPage />} />
                    <Route path='/dashboard' element={<DashboardPage />} />
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
            <Footer hiddenRoutes={hiddenRoutesFooter}/>
          </CsvProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App