import '../../index.css'
import {useEffect, useState} from "react";
import axios from "axios";

const Daily = () => {

    const [daily,setDaily] = useState([])

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

    useEffect( () => {
        const fetchData = async () => {

            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get(`https://localhost:44317/api/AdminPanel/GetDailyStats`)

                if (response.status !== 200) throw new Error("Error happened when filtering orders")

                setDaily(response.data)

            } catch (error) {
                console.log(error.response.data.message)
            }
        }
        fetchData()
    },[])

    return (
        <div className={"flex justify-center text-center flex-col content-center bg-slate-200 p-2"}>
            <h1 className={"text-md md:text-2xl mx-auto"}>Daily Stats</h1>
            <h1 className={"text-md md:text-lg"}>Current: <span className={"font-bold italic"}>{daily.date}</span></h1>
            <h1 className={"text-md md:text-lg"}>Total: <span className={"font-bold"}>{daily.dailyTotal} мкд</span></h1>
            <h1 className={"text-md md:text-lg"}>Profit: <span className={"font-bold"}>{daily.profit} мкд</span></h1>
        </div>
    )
}

export default Daily