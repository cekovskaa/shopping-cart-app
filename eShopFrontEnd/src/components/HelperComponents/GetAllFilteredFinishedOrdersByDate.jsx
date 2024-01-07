import '../../index.css'
import {useState} from "react";
import Datepicker from "react-tailwindcss-datepicker";
import axios from "axios";
import Swal from "sweetalert2";

const GetAllFilteredFinishedOrdersByDate = () => {

    const [orders,setOrders] = useState([])
    const [hidden,setHidden] = useState(true)

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

    const [value, setValue] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('en-us',{year: 'numeric', month: 'numeric', day: 'numeric'}),
        endDate: new Date().toLocaleDateString('en-us', { day:"numeric", year:"numeric", month:"numeric"})
    });

    const handleValueChange = newValue => {
        setValue(newValue);
    };

    const GetAllFilteredFinishedOrdersByDate = async () => {

        if(!value.startDate || !value.endDate){
           return Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Enter date range.",
                showConfirmButton: false,
                timer: 1500
            })
        }

        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.get(
                `https://localhost:44317/api/AdminPanel/GetAllFilteredFinishedOrdersByDate?startDate=${value.startDate}&endDate=${value.endDate}`)

            if (response.status !== 200) throw new Error("Error happened when filtering orders")

            if(Object.keys(response.data).length === 0){
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }

            setOrders(response.data)
            setHidden(false)

        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    return(
        <>
            <div className={"flex flex-col gap-2 justify-center items-center mt-3"}>
                <h1 className={"text-2xl font-bold mx-auto"}>Select date range:</h1>
                <div className={"w-4/6 md:w-3/6 border-solid border-2 rounded-lg border-gray-600"}>
                    <Datepicker value={value} onChange={handleValueChange}/>
                </div>
                <div className={"flex gap-2"}>
                    <button type="submit" onClick={() => {
                        GetAllFilteredFinishedOrdersByDate()
                    }}
                            className="text-white right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Filter
                    </button>
                    <button type="submit" onClick={() => {
                        setHidden(true)
                        setOrders([])
                    }}
                            className="text-white right-2.5 bottom-2.5 bg-red-700 hover:bg-red  -800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Clear
                    </button>
                </div>
            </div>

            {hidden === false && (
                <div
                className={"mt-5 flex flex-col justify-center container overflow-auto mx-auto w-11/12 border-solid border-2 rounded-lg drop-shadow-xl mb-7"}>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                    <thead className="text-sm text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Order ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Ordered by
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Comment
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Handled By Employee
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Total Sum
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Delivery Address
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr className="h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={order.id}>
                            <td className="p-10 font-bold text-gray-900 text-base font-semibold">
                                {order.id}
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                {order.user}
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                {order.comment}
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                {order.soldFromEmployee}
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                {order.date}
                            </td>
                            <td className="whitespace-nowrap px-4 py-6 text-gray-900 text-base font-semibold">
                                {order.totalSum} мкд
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                {order.deliveryAddress}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>)}
        </>
    )
}

export default GetAllFilteredFinishedOrdersByDate
