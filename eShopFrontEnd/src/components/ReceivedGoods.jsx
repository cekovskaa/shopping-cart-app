import '../index.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "../AuthProvider/AuthContext.jsx";
import {Navigate} from "react-router-dom";
import Swal from "sweetalert2";

const ReceivedGoods = () => {

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

    const [logs,setLogs] = useState([])

    const {role,isAuthenticated} = useAuth()

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get("https://localhost:44317/api/ReceivedGoods/ViewReceivedGoods")

                if (response.status !== 200) throw new Error("Error happened when pulling categories")
                setLogs(response.data.reverse())

            } catch (error) {
                console.log(error.message)
            }
        }
        fetchLogs()
    },[])

    const generateReport = async () => {
        try {

            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.get(
                `https://localhost:44317/api/ReceivedGoods/GenerateReceivedGoodsPDF`,
                {
                    responseType: "blob",
                }
            );

            if (response.status !== 200) throw new Error("Error happened when pulling logs for you")

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = `Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "No logs were found from you today.",
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    if(!isAuthenticated){
        return (
            <Navigate to={{pathname: "/login", state: {from: location}}}/>
        )
    }else if(!(role === "OWNER" || role === "ADMIN" || role === "EMPLOYEE")){
        return (
            <Navigate to={{pathname: "/UnauthorizedAccess", state: {from: location}}}/>
        )
    }
    else{
        return (
            <>
                <div className={"my-2 p-2 flex justify-end container overflow-auto mx-auto w-11/12 border-solid border-2 rounded-lg drop-shadow-xl"}>
                    <button
                        onClick={() => {
                            generateReport()
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Generate Report
                    </button>
                </div>
                <div
                    className={"flex flex-col justify-center container overflow-auto mx-auto w-11/12 border-solid border-2 rounded-lg drop-shadow-xl mb-7"}>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                        <thead className="text-sm text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Product ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product image
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Received By
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date of receival
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Quantity Received
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {logs.map((log,index) => (
                            <tr className="h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                <td className="p-10 font-bold text-gray-900 text-base font-semibold">
                                    {log.product.id}
                                </td>
                                <td className="p-10 font-bold text-gray-900 text-base font-bold">
                                    {log.product.productName}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    {log.product.productDescription}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    <img className={"mx-auto"} src={log.product.productImageURL} alt={log.product.productName}
                                         width="50" height="50"/>
                                </td>
                                <td className={"px-4 py-6 text-gray-900 text-base font-bold"}>
                                    {log.user.username}
                                </td>
                                <td className={"px-4 py-6 text-gray-900 text-base font-bold"}>
                                    {log.receivedOn}
                                </td>
                                <td className={"px-4 py-6 text-gray-900 text-base font-bold"}>
                                    {log.productQuantity} pieces
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default ReceivedGoods