import { useMemo, useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { useAuth } from "../../context/AuthContext";
import { getCsvDatoRequest } from "../../api/csvDatos";
import Papa from "papaparse";
import { useNavigate } from "react-router";

function Top10NeighborhoodSales() {
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
            navigate("/inicio");
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
            Papa.parse(response.data, {
                complete: (parsedData) => {
                    const data = parsedData.data.map((row) => ({
                        ...row,
                        date: row.date, // No se formatea la fecha
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
    const neighborhoodSales = {};

    for (let i = 0; i < csvDataFiltered.length; i++) {
        const rowData = csvDataFiltered[i];
        const neighborhood = rowData.neighborhood;

        if (neighborhoodSales[neighborhood]) {
            neighborhoodSales[neighborhood]++;
        } else {
            neighborhoodSales[neighborhood] = 1;
        }
    }

    const sortedNeighborhoods = Object.keys(neighborhoodSales).sort((a, b) => neighborhoodSales[b] - neighborhoodSales[a]);

    const top10Neighborhoods = sortedNeighborhoods.slice(0, 10);

    // Prepare data for ApexCharts
    const chartData = {
        options: {
            chart: {
                type: "line",
                height: 400,
            },
            xaxis: {
                categories: top10Neighborhoods,
                title: {
                    text: "Neighborhood",
                },
            },
            yaxis: {
                title: {
                    text: "Sales Quantity",
                },
            },
        },
        series: [
            {
                name: "Sales Quantity",
                data: top10Neighborhoods.map((neighborhood) => neighborhoodSales[neighborhood]),
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
            <h1 className="text-center">TOP 10 NEIGHBORHOOD SALES</h1>
            <ApexCharts options={chartData.options} series={chartData.series} type="line" height={400} />
        </div>
    );
}

export default Top10NeighborhoodSales;
