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
import NotFoundPage from './pages/NotFoundPage';

// Rutas usuarios logueados
import UploadFile from './pages/UploadFile';
import Profile from './pages/Profile';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import RevenueByCategory from './components/Charts/RevenuebyCategory';
import SalesByNeighborhood from './components/Charts/SalesByNeighborhood';
import SalesTrendOverTime from './components/Charts/SalesTrendOverTime';
import SalesByMonth from './components/Charts/SalesByMonth';
import SalesByState from './components/Charts/SalesByState';
import OrdersByMonth from './components/Charts/OrdersByMonth';

// Rutas admin
import ListarUsuariosPage from './pages/ListarUsuariosPage';

// Rutas representante
import RegistroEmpleadoPage from './pages/RegistroEmpleadoPage';
import ListarEmpleadosPage from './pages/ListarEmpleadosPage';


function App() {
  const hiddenRoutes = ['/login', '/registro']
  const hiddenRoutesFooter = ['/login', '/registro','/uploadfile','/perfil','/perfil/ChangePassword','/dashboard','/goals','/revenue-by-category','/sales-by-neighborhood','/sales-trend-over-time','/sales-by-month','/sales-by-state','/orders-by-month','/ListarUsuarios','/RegistrarEmpleado','/ListarEmpleados']
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
                    <Route path='/uploadfile' element={<UploadFile />} />
                    <Route path='/perfil' element={<Profile />} />
                    <Route path='/perfil/ChangePassword' element={<ChangePasswordPage />} />
                    <Route path='/dashboard' element={<DashboardPage />} />
                    <Route path='/goals' element={<GoalsPage />} />
                    {/*Charts*/}
                    <Route path="/revenue-by-category" element={<RevenueByCategory />} />
                    <Route path="/sales-by-neighborhood" element={<SalesByNeighborhood />} />
                    <Route path="/sales-trend-over-time" element={<SalesTrendOverTime />} />
                    <Route path="/sales-by-month" element={<SalesByMonth />} />
                    <Route path="/sales-by-state" element={<SalesByState />} />
                    <Route path="/orders-by-month" element={<OrdersByMonth />} />
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

                  {/* Pagina no encontrada */}
                  <Route path="*" element={<NotFoundPage />} />
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