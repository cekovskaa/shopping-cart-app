import '../../index.css'
import {useEffect, useState} from "react";
import axios from "axios";

const MonthDifference = () => {
    const [data, setData] = useState([])

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }

    useEffect(() => {
        const fetchData = async () => {

            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get(`https://localhost:44317/api/AdminPanel/CompareCurrentWithMonthBefore`)

                if (response.status !== 200) throw new Error("Error happened when filtering orders")

                setData(response.data)

            } catch (error) {
                console.log(error.response.data.message)
            }
        }
        fetchData()
    }, [])

    return (
        <>
            <div className={"flex justify-center text-center flex-col content-center bg-slate-200 p-2"}>
                <h1 className={"text-md md:text-lg"}>Current month: <span
                    className={"font-bold"}>{data.currentMonth}</span></h1>
                <h1 className={"text-md md:text-lg"}>Total: <span
                    className={"font-bold"}>{data.currentMonthTotal} мкд</span></h1>
                <h1 className={"text-md md:text-lg"}>Profit: <span
                    className={"font-bold"}>{data.currentMonthProfit} мкд</span></h1>
            </div>
            <div
                className={data.currentMonthProfit < data.previousMonthProfit ?
                    "flex justify-center text-center flex-col content-center bg-red-200 p-2"
                    : "flex justify-center text-center flex-col content-center bg-green-200 p-2"}>
                <h1 className={"text-md md:text-lg"}>Difference: <span
                    className={"font-bold"}>
                    {
                        data.currentMonthProfit - data.previousMonthProfit > 0 ? "+" : "-"
                    }
                    {
                    data.currentMonthProfit - data.previousMonthProfit
                } мкд</span></h1>
            </div>
            <div className={"flex justify-center text-center flex-col content-center bg-slate-200 p-2"}>
                <h1 className={"text-md md:text-lg"}>Previous month: <span
                    className={"font-bold"}>{data.previousMonth}</span></h1>
                <h1 className={"text-md md:text-lg"}>Total: <span
                    className={"font-bold"}>{data.previousMonthTotal} мкд</span></h1>
                <h1 className={"text-md md:text-lg"}>Profit: <span
                    className={"font-bold"}>{data.previousMonthProfit} мкд</span></h1>
            </div>
        </>
    )
}

export default MonthDifference