import '../index.css'
import {useAuth} from "../AuthProvider/AuthContext.jsx";
import {Navigate} from "react-router-dom";
import GetAllFilteredFinishedOrdersByDate from "./HelperComponents/GetAllFilteredFinishedOrdersByDate.jsx";
import PieChart from "./HelperComponents/PieChart.jsx";
import {useState} from "react";
import LineChart from "./HelperComponents/LineChart.jsx";
import Daily from "./HelperComponents/Daily.jsx";
import Monthly from "./HelperComponents/Monthly.jsx";
import MonthDifference from "./HelperComponents/MonthDifference.jsx";
import Yearly from "./HelperComponents/Yearly.jsx";

const Statistics = () => {

    const {role, isAuthenticated} = useAuth()

    const [filterByDate, setFilterByDate] = useState(false)

    const handleCheckboxChange = (event) => {
        setFilterByDate(event.target.checked);
    };

    if (isAuthenticated) {
        if (role === "ADMIN" || role === "OWNER") {
            return (
                <>
                    <div className="flex justify-center items-center mt-5">
                        <input id="default-checkbox" type="checkbox" value=""
                               checked={filterByDate}
                               onChange={handleCheckboxChange}
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="default-checkbox"
                               className="ml-2 text-lg font-medium text-gray-900 dark:text-gray-300">Enable filter by
                            date</label>
                    </div>
                    {filterByDate && (
                        <GetAllFilteredFinishedOrdersByDate/>
                    )}
                    <div className={"flex flex-col justify-between sm:flex-row p-12"}>
                        <PieChart/>
                        <LineChart/>
                    </div>

                    <div
                        className={"mb-3 w-11/12 mx-auto flex justify-center border-solid border-2 rounded-lg drop-shadow-lg p-2"}>
                        <h1 className={"text-2xl font-bold mx-auto"}>Overall Stats</h1>
                    </div>
                    <div className={"p-3 w-11/12 mx-auto mb-3 flex flex-col md:flex-row gap-3 justify-between border-solid border-2 rounded-lg drop-shadow-lg"}>
                        <Daily/>
                        <Monthly/>
                        <Yearly/>
                    </div>
                    <div className={"flex flex-col gap-2 text-center"}>
                        <div
                            className={"w-11/12 mx-auto flex justify-center border-solid border-2 rounded-lg drop-shadow-lg p-2"}>
                            <h1 className={"text-md md: text-2xl font-bold mx-auto"}>Current/Previous Month Stats
                                Comparison</h1>
                        </div>
                        <div
                            className={"mb-3 gap-3 p-5 flex flex-col md:flex-row container justify-between mx-auto w-11/12 border-solid border-2 rounded-lg drop-shadow-lg "}>
                            <MonthDifference/>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <Navigate to={{pathname: "/UnauthorizedAccess", state: {from: location}}}/>
            )
        }
    } else {
        return (
            <Navigate to={{pathname: "/login", state: {from: location}}}/>
        )
    }

}

export default Statistics