import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { getCsvDatoRequest, getPredictRequest } from "../api/csvDatos";
import { getGoalRequest } from "../api/goals";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import moment from 'moment';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import GoalDialog from '../components/GoalDialog';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();
  const [csvData, setCsvData] = useState([]);
  const [predictData, setPredictData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [goalData, setGoalData] = useState([])
  const [lastCsvDate, setLastCsvDate] = useState(null);

  const getCsv = async () => {
    try {
      const response = await getCsvDatoRequest(usuario.company);

      Papa.parse(response.data, {
        complete: (parsedData) => {
          const data = parsedData.data.map((row) => ({
            ...row,
            date: moment(row.date, 'YYYY-MM-DD'), // Parse the date string
          }));

          // Sort the data by date
          data.sort((a, b) => a.date - b.date);

          // Format the date back to the desired format if needed
          const formattedData = data.map((row) => ({
            ...row,
            date: row.date.format('YYYY-MM-DD'),
          }));

          setCsvData(formattedData);
          setDataAvailable(true);
        },
        header: true,
        skipEmptyLines: true,
      });
      setLoading(true);
    } catch (error) {
      console.log("Error al obtener los datos:", error);
      setDataAvailable(false);
    } finally {
      setLoading(false)
    }
  };

  const handleOpen = (e) => {
    setOpen(true)
  };

  const handleClose = () => {
    getGoal();
    setOpen(false);
  }

  useEffect(() => {
    // Simulación de tiempo de carga
    setTimeout(() => {
      const totalOrders = csvData.length;
      // Dar formato al número total de órdenes con puntos como separadores de miles
      const formattedTotalOrders = totalOrders.toLocaleString();

      // Calcular el monto total de ventas sumando los valores de "skuValue" del CSV
      const totalSales = csvData.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.skuValue);
      }, 0);

      // Dar formato al monto total con puntos como separadores de miles
      const formattedTotalSales = totalSales.toLocaleString();

      // Guardar los valores en localStorage
      localStorage.setItem('totalOrders', formattedTotalOrders);
      localStorage.setItem('totalSales', formattedTotalSales);

      setTotalOrders(formattedTotalOrders);
      setTotalSales(formattedTotalSales);
    }, 1000); // Simulación de tiempo de carga
  }, [csvData]);

  const getLastDate = (data) => {
    if (data.length > 0) {
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      const lastDate = sortedData[sortedData.length - 1].date;
      return lastDate;
    }
  };

  useEffect(() => {
    const lastDate = getLastDate(csvData);
    setLastCsvDate(lastDate);
  }, [csvData]);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  useEffect(() => {
    getCsv();
  }, []);

  useEffect(() => {
    getPredict();
  }, []);

  useEffect(() => {
    getGoal();
  }, [])

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("#8F3C8A"),
    backgroundColor: "#8F3C8A",
    '&:hover': {
      backgroundColor: "#ba68c8",
    },
    fontFamily: 'Poppins',
  }));

  const calculateTotalPredictedSales = () => {
    if (predictData.predictions && predictData.predictions.length > 0) {
      const predictedSales = predictData.predictions.map((prediction) => prediction.skuValue);
      const totalPredictedSales = predictedSales.reduce((total, prediction) => total + prediction, 0);
      return totalPredictedSales;
    }
    return 0;
  };

  const totalPredictedSales = calculateTotalPredictedSales();

  const formattedTotalPredictedSales = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(totalPredictedSales);

  const formattedGoal = goalData.amount
    ? new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(goalData.amount)
    : "No registra meta";

  const getPredict = async () => {
    try {
      const res = await getPredictRequest(usuario.company);
      setPredictData(res.data);
      setLoading(true)
    } catch (error) {
      console.log("Error al predecir", error);
    } finally {
      setLoading(false)
    }
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    formattedDate.setDate(formattedDate.getDate() + 1);

    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getGoal = async () => {
    try {
      const res = await getGoalRequest(usuario.company);
      const formattedStartDate = formatDate(res.data.startDate);
      const formattedEndDate = formatDate(res.data.endDate);
      setGoalData({
        ...res.data,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    } catch (error) {
      console.log("Error al obtener la meta", error);
    }
  };

  const Prediction = () => {
    let sortedChartData = [["Fecha", "Total ", "Prediccion ", "Meta "]];

    if (csvData.length === 0) {
      return <div>No hay datos disponibles para graficar.</div>;
    }

    // Encuentra la última fecha en el archivo CSV
    const lastDate = new Date(csvData[csvData.length - 1].date);

    // Calcula la fecha de inicio para los últimos 30 días
    const thirtyDaysAgo = new Date(lastDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Filtra los datos para incluir solo los últimos 30 días
    const last30DaysData = csvData.filter((rowData) => {
      const fecha = new Date(rowData.date);
      return fecha >= thirtyDaysAgo;
    });

    // Crea un objeto para mantener un seguimiento de los valores acumulados por día
    const dailyTotal = {};
    const dailyPredicted = {}; // Para almacenar las predicciones diarias


    // Recorre los datos de los últimos 30 días
    for (let i = 0; i < last30DaysData.length; i++) {
      const rowData = last30DaysData[i];
      const fecha = new Date(rowData.date);
      const valorTotal = parseInt(rowData.skuValue); // Convertir a número

      // Encuentra la predicción correspondiente para esta fecha
      const predictedValues = predictData.predictions[0]; // asumiendo que solo hay una predicción
      const predictedValue = predictedValues[i]; // predicción para el mismo período de tiempo que los datos originales

      // Obtiene la fecha en formato YYYY-MM-DD
      const dateKey = fecha.toISOString().split('T')[0];

      // Agrega el valor actual al valor acumulado para este día
      if (dailyTotal[dateKey]) {
        dailyTotal[dateKey].total += valorTotal;
        dailyTotal[dateKey].predicted += predictedValue;
      } else {
        dailyTotal[dateKey] = {
          total: valorTotal,
          predicted: predictedValue,
        };
      }

      // También almacena la predicción diaria
      dailyPredicted[dateKey] = predictedValue;
    }

    // Convierte los datos diarios en un arreglo para el gráfico
    const sortedDates = Object.keys(dailyTotal).sort();

    for (const dateKey of sortedDates) {
      const total = dailyTotal[dateKey].total;
      const predicted = dailyTotal[dateKey].predicted;
      sortedChartData.push([dateKey, total, predicted, null]);
    }

    if (predictData.predictions && predictData.predictions.length > 0) {
      predictData.predictions.forEach((prediction) => {
        sortedChartData.push([prediction.date, null, prediction.skuValue, null]);
      });
    }

    //AQUI VAN LOS DATOS DE LAS METAS
    // Obtener la fecha de inicio y fin de la meta y el monto total
    const startDate = new Date(goalData.startDate);
    const endDate = new Date(goalData.endDate);
    const totalAmount = goalData.amount;

    // Calcular la cantidad diaria para alcanzar la meta
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Diferencia en días
    const dailyAmount = parseInt(totalAmount / daysDiff);

    /// Crear datos para la línea de meta
    const dailyGoals = [];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyGoals.push([dateKey, null, null, dailyAmount]);
      currentDate.setDate(currentDate.getDate() + 1); // Avanzar al siguiente día
    }
    // FIN DE LOS DATOS DE LAS METAS

    //Combinar fechas de meta y prediccion
    let allData = [...sortedChartData]; // Comenzamos con los datos de ventas y predicciones

    if (goalData.startDate && goalData.endDate && goalData.amount) {
      for (const goal of dailyGoals) {
        const existingIndex = allData.findIndex((item) => item[0] === goal[0]);

        if (existingIndex !== -1) {
          // Si la fecha ya existe en los datos combinados, actualiza la columna de meta
          allData[existingIndex][3] = goal[3]; // Columna de meta
        } else {
          // Si la fecha no existe, agrega la información completa de la meta
          allData.push(goal);
        }
      }
    }
    // Ordena los datos combinados por fecha
    allData.sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA - dateB;
    });

    const hasGoals = goalData.startDate && goalData.endDate && goalData.amount;

    if (hasGoals && allData.length > 0) {
      return (
        <div>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={allData}
            options={{
              hAxis: {
                title: "Fecha",
              },
              vAxis: {
                title: "Valor",
              },
              series: {
                0: {
                  curveType: 'function', // Esto asegura que la línea esté curvada
                  lineWidth: 2, // Ajusta el grosor de la línea para la meta
                  color: '#8F3C8A',
                },
                1: {
                  curveType: 'function', // Esto asegura que la línea esté curvada
                  lineWidth: 2, // Ajusta el grosor de la línea para la meta
                  color: '#F03A56',
                },
                2: {
                  curveType: 'function', // Esto asegura que la línea esté curvada
                  lineWidth: 2, // Ajusta el grosor de la línea para la meta
                  lineDashStyle: [4, 4], // Establece un estilo de línea punteada
                  color: '#F39962',
                },
                3: {
                  curveType: 'function', // Esto asegura que la línea esté curvada
                  lineWidth: 2, // Ajusta el grosor de la línea para la meta
                  lineDashStyle: [4, 4], // Establece un estilo de línea punteada
                },
              },
              pointSize: 6,
              legend: {
                position: "bottom",
              },
            }}
          />
        </div>
      );
    } else {
      const sortedChartData = [["Fecha", "Total ", "Prediccion "]];

      if (csvData.length === 0) {
        return <div>No hay datos disponibles para graficar.</div>;
      }

      // Encuentra la última fecha en el archivo CSV
      const lastDate = new Date(csvData[csvData.length - 1].date);

      // Calcula la fecha de inicio para los últimos 30 días
      const thirtyDaysAgo = new Date(lastDate);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Filtra los datos para incluir solo los últimos 30 días
      const last30DaysData = csvData.filter((rowData) => {
        const fecha = new Date(rowData.date);
        return fecha >= thirtyDaysAgo;
      });

      // Crea un objeto para mantener un seguimiento de los valores acumulados por día
      const dailyTotal = {};
      const dailyPredicted = {}; // Para almacenar las predicciones diarias

      // Recorre los datos de los últimos 30 días
      for (let i = 0; i < last30DaysData.length; i++) {
        const rowData = last30DaysData[i];
        const fecha = new Date(rowData.date);
        const valorTotal = parseInt(rowData.skuValue); // Convertir a número

        // Encuentra la predicción correspondiente para esta fecha
        const predictedValues = predictData.predictions[0]; // asumiendo que solo hay una predicción
        const predictedValue = predictedValues[i]; // predicción para el mismo período de tiempo que los datos originales

        // Obtiene la fecha en formato YYYY-MM-DD
        const dateKey = fecha.toISOString().split('T')[0];

        // Agrega el valor actual al valor acumulado para este día
        if (dailyTotal[dateKey]) {
          dailyTotal[dateKey].total += valorTotal;
          dailyTotal[dateKey].predicted += predictedValue;
        } else {
          dailyTotal[dateKey] = {
            total: valorTotal,
            predicted: predictedValue,
          };
        }

        // También almacena la predicción diaria
        dailyPredicted[dateKey] = predictedValue;
      }

      // Convierte los datos diarios en un arreglo para el gráfico
      const sortedDates = Object.keys(dailyTotal).sort();

      for (const dateKey of sortedDates) {
        sortedChartData.push([dateKey, dailyTotal[dateKey].total, dailyTotal[dateKey].predicted]);
      }

      if (predictData.predictions && predictData.predictions.length > 0) {
        predictData.predictions.forEach((prediction) => {
          sortedChartData.push([prediction.date, null, prediction.skuValue]);
        });
      }

      return (
        <div>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={sortedChartData}
            options={{
              hAxis: {
                title: "Date",
              },
              vAxis: {
                title: "Value",
              },
              series: {
                0: { curveType: "function" },
                1: { curveType: "function" },
              },
              pointSize: 6, // Ajusta el tamaño de los puntos en la línea
              legend: {
                position: "bottom",
              },
            }}
          />
        </div>
      );
    }
  };

  return (
    <div className="mt-14">
      {loading ? (
        <div className="text-center"> Cargando ... </div>
      ) : (
        <>
          {dataAvailable ? (
            <div>
              <div className="flex flex-wrap lg:flex-nowrap justify-center">
                <div className="bg-gray-100 dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-400">Ganancias</p>
                      <p className="text-2xl">${totalSales}</p>
                    </div>
                    <button type="button" className="ml-auto text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4 bg-[#7f3ca5]">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      ><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122-.11 1.879-.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"></path></svg>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-100 dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-60 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-400">Total de Pedidos</p>
                      <p className="text-2xl">{totalOrders}</p>
                    </div>
                    <button type="button" className="ml-auto text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl bg-[#7f3ca5] text-white">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      ><path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5.5 0 1 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"></path></svg>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-100 dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-400">Ventas previstas</p>
                      <p className="text-2xl">{formattedTotalPredictedSales}</p>
                    </div>
                    <button type="button" className="ml-auto text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl bg-[#7f3ca5] text-white">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      ><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122-.11 1.879-.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"></path></svg>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-100 dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-400">Meta</p>
                      <p className="text-2xl">{formattedGoal}</p>
                    </div>
                    <button type="button" className="ml-auto text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl bg-[#7f3ca5] text-white">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5.5 0 1 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"></path>
                      </svg>
                    </button>
                  </div>
                  <Button color='secondary' variant="contained" onClick={(e) => { handleOpen(e) }}>
                    Añadir meta
                  </Button>
                  {open && <GoalDialog open={open} handleClose={handleClose} formattedTotalPredictedSales={formattedTotalPredictedSales} lastCsvDate={lastCsvDate} />}
                </div>
              </div>
              {csvData.length > 0 && predictData.predictions ? (
                <Prediction csvData={csvData} predictData={predictData} />
              ) : (<h1 className="text-center">No hay suficientes datos para predecir</h1>)}
            </div>
          ) : (
            <>
              <h1 className="text-center">No se han subido datos, debes subir un CSV</h1>
              <div className="font-sans text-center">
                <Link to="/uploadfile" ><ColorButton >Haga clic aquí para cargar CSV</ColorButton></Link>
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}