import '../../index.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {Line,} from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from "chart.js";

ChartJS.register(LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

const LineChart = () => {

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

                const response = await axiosInstance.get(`https://localhost:44317/api/AdminPanel/GetMonthlyOrderCount`)

                if (response.status !== 200) throw new Error("Error happened when filtering orders")

                setOrders(response.data)

            } catch (error) {
                console.log(error.response.data.message)
            }
        }
        formPieChart()
    },[])

    const data = {
        labels: orders.map((order) => order.month),
        datasets: [
            {
                label: "Total Delivered",
                data: orders.map((order) => order.orderCount),
                backgroundColor: 'green',
                pointBorderColor: 'green'
            },
        ],
    }

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
                text: `Yearly overlook`,
                font: {
                    size: 22
                }
            },
        },
        scales: {
          y: {
              ticks: {
                  stepSize: 1
              }
          }
        },
    };

    return(
        <div className={"container w-full h-72"}>
            <Line data={data} options={options}/>
        </div>
    )
}

export default LineChart