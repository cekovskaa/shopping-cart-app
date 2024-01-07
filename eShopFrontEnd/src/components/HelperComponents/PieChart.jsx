import '../../index.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {Pie} from "react-chartjs-2";
import {Chart, ArcElement, Tooltip, Legend, Title} from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend, Title);

const PieChart = () => {

    const [orders,setOrders] = useState([])

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
        const formPieChart = async () => {

            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get(`https://localhost:44317/api/AdminPanel/GetAllOrdersCountByStatus`)

                if (response.status !== 200) throw new Error("Error happened when filtering orders")

                setOrders(response.data)

            } catch (error) {
                console.log(error.response.data.message)
            }
        }
        formPieChart()
    },[])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: `Order status overview`,
                font: {
                    size: 22
                }
            },
        },
    };

    const data = {
        labels: Object.keys(orders).map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
        datasets: [
            {
                label: "Total",
                data: [
                        orders.delivered,
                        orders.processing,
                        orders.canceled,
                    ],
                backgroundColor: [
                    'rgba(57, 250, 67, 0.8)',
                    'rgba(57, 140, 250, 0.8)',
                    'rgba(250, 16, 58, 0.8)',
                ],
            },
        ],
    }

    return (
        <div className={"container w-full h-72"}>
            <Pie data={data} options={options}/>
        </div>
    )
}

export default PieChart
