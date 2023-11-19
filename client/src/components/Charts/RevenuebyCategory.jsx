import { useMemo, useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { useAuth } from "../../context/AuthContext";
import { getCsvDatoRequest } from "../../api/csvDatos";
import Papa from "papaparse";
import moment from "moment";
import { useNavigate } from "react-router";

function Top10RevenuesByCategory() {
    const navigate = useNavigate();
    const { isAuthenticated, usuario, setAuthenticated } = useAuth();
    const [csvData, setCsvData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");

    useEffect(() => {
        const isAuthenticatedFromLocalStorage = localStorage.getItem("isAuthenticated");
        if (isAuthenticatedFromLocalStorage === "true") {
            setAuthenticated(true);
        }
    }, [setAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        getCsv();
    }, []);

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year);
    };

    const filterAndProcessDataByYear = (data, selectedYear) => {
        if (!selectedYear) return [];
        return data.filter((rowData) => {
            const fecha = new Date(rowData.date);
            return fecha.getFullYear().toString() === selectedYear;
        });
    };

    async function getCsv() {
        try {
            const response = await getCsvDatoRequest(usuario.company);
            console.log("Respuesta de la API:", response);
            Papa.parse(response.data, {
                complete: (parsedData) => {
                    const data = parsedData.data.map((row) => ({
                        ...row,
                        date: moment(row.date).format("YYYY-MM-DD"),
                        price: parseFloat(row.price), // Convierte a número
                    }));
                    setCsvData(data);
                },
                header: true,
                skipEmptyLines: true,
            });
        } catch (error) {
            console.log("Error al obtener los datos:", error);
        }
    }

    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const categorySales = {};

    for (let i = 0; i < csvDataFiltered.length; i++) {
        const rowData = csvDataFiltered[i];
        const category = rowData.category;

        if (categorySales[category]) {
            categorySales[category]++;
        } else {
            categorySales[category] = 1;
        }
    }

    const sortedCategories = Object.keys(categorySales).sort((a, b) => categorySales[b] - categorySales[a]);

    const top10Categories = sortedCategories.slice(0, 10);

    // Prepare data for ApexCharts
    const chartData = {
        options: {
            chart: {
                type: "area",
                height: 400,
            },
            xaxis: {
                categories: top10Categories,
                title: {
                    text: "Categoria",
                },
            },
            yaxis: {
                title: {
                    text: "Cantidad",
                },
            },
            colors: ["#8F3C8A"],
        },
        series: [
            {
                name: "Cantidad vendida",
                data: top10Categories.map((category) => categorySales[category]),
            },
        ],
    };

    return (
        <div>
            <div className="select-container">
                <select
                    className="select-element"
                    value={selectedYear}
                    onChange={handleYearChange}
                >
                    <option value="">Select a Time</option>
                    {csvData
                        .map((rowData) => new Date(rowData.date).getFullYear())
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .map((year) => (
                            <option
                                key={year}
                                value={year}
                                className={selectedYear === year ? "selected" : ""}
                            >
                                {year}
                            </option>
                        ))}
                </select>
            </div>
            <h1 className="text-center">TOP 10 CATEGORIAS MAS VENDIDAS</h1>
            <ApexCharts options={chartData.options} series={chartData.series} type="area" height={400} />
        </div>

    );
}

export default Top10RevenuesByCategory;
