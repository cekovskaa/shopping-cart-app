import "../index.css"
import axios from "axios";
import {useEffect, useState} from "react";
import {useAuth} from "../AuthProvider/AuthContext.jsx";
import Swal from "sweetalert2";
import {Modal} from "react-responsive-modal";

const Orders = () => {

    const {user,} = useAuth()

    const [orders, setOrders] = useState([])

    const [open, setOpen] = useState(false);

    const [newComment, setNewComment] = useState("")
    const [newPhoneNumber,setNewPhoneNumber] = useState("")
    const [orderId,setOrderId] = useState(0)

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

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
        const fetchOrders = async () => {
            try {

                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get(`https://localhost:44317/api/Orders/GetAllOrdersForBuyer`)

                if (response.status !== 200) throw new Error("Error happened when pulling products")

                setOrders(response.data.reverse())

            } catch (error) {
                console.log(error.message)
            }
        }
        fetchOrders()
    }, [user])


    const cancelOrder = async (orderId) => {
        try {

            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.put(`https://localhost:44317/api/Orders/CancelOrder/${orderId}`)

            if (response.status !== 200) throw new Error("Error happened when pulling products")

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.reload()
            })

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

    const editOrder = async (orderId) => {
        try {

            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.put(`https://localhost:44317/api/Orders/EditOrder/${orderId}`, {
                Comment: newComment,
                PhoneNumber: newPhoneNumber,
            })

            if (response.status !== 200) throw new Error("Error happened when pulling products")

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.reload()
            })

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

    const generateReport = async (orderId) => {
        try {

            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.get(
                `https://localhost:44317/api/Orders/GeneratePDFConfirmationDocument?orderId=${orderId}`,
                {
                    responseType: "blob",
                }
            );
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = `Order_${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error fetching PDF:", error);
        }
    }

    return (
        <>
            <div
                className="container overflow-auto mx-auto w-11/12 mt-5 border-solid border-2 rounded-lg drop-shadow-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                    <thead className="text-sm text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Order ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Order Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Order Comment
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date Created
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Delivery Address
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Phone Number
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Total Sum
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Comment After Review
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr className="h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={order.id}>
                            <td className="p-10 font-bold text-gray-900 text-base font-semibold ">
                                {order.id}
                            </td>
                            <td className={order.orderStatus === "Canceled" ? 'bg-red-400 px-4 py-6 text-gray-900 text-base font-semibold' : order.orderStatus === "Delivered" ?
                                'bg-green-400 px-4 py-6 text-gray-900 text-base font-semibold' : 'bg-blue-400 px-4 py-6 text-gray-900 text-base font-semibold'}>
                                {order.orderStatus}
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                {order.comment === "" ?
                                    <span className={"text-red-500"}>No comment</span> : order.comment}
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                {order.dateCreated}
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                {order.address}
                            </td>
                            <td className="px-6 py-4 text-gray-900 text-base font-semibold">
                                {order.phoneNumber}
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-semibold font-extrabold">
                                {order.totalSum} мкд
                            </td>
                            <td className="px-4 py-6 text-gray-900 text-base font-semibold font-extrabold">
                                {order.commentFromEmployee === null ? <span className={"text-red-500"}>No comment from an employee yet..</span> : order.commentFromEmployee}
                            </td>
                            <td className={"px-4 py-6 flex-col"}>
                                {order.orderStatus !== "Canceled" && order.orderStatus !== "Delivered" && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setOrderId(order.id)
                                                onOpenModal()
                                            }}
                                            className="mb-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                            Edit Order
                                        </button>
                                        <button
                                            onClick={() => {
                                                generateReport(order.id)
                                            }}
                                            className="mb-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                            Generate PDF
                                        </button>
                                        <button
                                            onClick={() => {
                                                cancelOrder(order.id)
                                            }}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                            Cancel Order
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>

                    ))}
                    </tbody>
                </table>
            </div>
            <Modal open={open} onClose={onCloseModal}>
                <div className={"flex justify-center flex-col gap-2"}>
                    <label>Enter a new comment:</label>
                    <input type="text"
                           onChange={(e) => {
                               setNewComment(e.target.value)
                           }}
                           id={"newComment"}
                           placeholder={"Ex: John Doe..."}
                           className="border rounded-lg px-3 py-2 text-sm w-full"/>
                    <label>Enter your new address:</label>
                    <input type="text"
                           onChange={(e) => {
                               setNewPhoneNumber(e.target.value)
                           }}
                           id={"newPhoneNumber"}
                           placeholder={"Ex: Street Name, #18, Country Name, Zip Code"}
                           className="border rounded-lg px-3 py-2 text-sm w-full"/>
                    <button
                        onClick={() => {
                            editOrder(orderId)
                        }}
                        className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                        Confirm Order
                        <div
                            className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default Orders