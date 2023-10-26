import { useMemo, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useAuth } from "../../context/AuthContext";
import { getCsvDatoRequest } from "../../api/csvDatos";
import Papa from "papaparse";
import { useNavigate } from "react-router";

function SalesByState() {
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

    async function getCsv() {
        try {
            const response = await getCsvDatoRequest(usuario.company);
            Papa.parse(response.data, {
                complete: (parsedData) => {
                    const data = parsedData.data.map((row) => ({
                        ...row,
                        state: row.state, // Mantenemos el nombre del estado sin cambios
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
    const filterAndProcessDataByYear = (data, selectedYear) => {
        if (!selectedYear) return [];
        return data.filter((rowData) => {
            const fecha = new Date(rowData.date);
            return fecha.getFullYear().toString() === selectedYear;
        });
    }
    const csvDataFiltered = useMemo(() => filterAndProcessDataByYear(csvData, selectedYear), [csvData, selectedYear]);
    const stateSales = {};
    const chartData = [["State", "Sales Quantity"]];

    for (let i = 0; i < csvDataFiltered.length; i++) {
        const rowData = csvDataFiltered[i];
        const state = rowData.state;

        if (stateSales[state]) {
            stateSales[state]++;
        } else {
            stateSales[state] = 1;
        }
    }

    for (const state in stateSales) {
        chartData.push([state, stateSales[state]]);
    }


    return (
        <div>
            <div className="select-container">
                <select
                    className="select-element"
                    value={selectedYear}
                    onChange={handleYearChange}
                >
                    <option value="">Select a Year</option>
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
            <h1 className="font-normal text-center">Sales Quantity by State</h1>
            <Chart
                chartType="Scatter"
                width="100%"
                height="400px"
                data={chartData}
                options={{
                    title: "",
                    hAxis: { title: "Sales Quantity" },
                    vAxis: { title: "State" },
                }}
            />
        </div>
    );

}

export default SalesByState;
