import '../index.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {Modal} from "react-responsive-modal";
import {useAuth} from "../AuthProvider/AuthContext.jsx";
import {Navigate} from "react-router-dom";
import Swal from "sweetalert2";

const ActiveOrders = () => {

    const {role,isAuthenticated} = useAuth()

    //view products in order
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    //cancel order by employee
    const [openSecond, setOpenSecond] = useState(false);
    const onOpenModalSecond = () => setOpenSecond(true);
    const onCloseModalSecond = () => setOpenSecond(false);

    const [openThird, setOpenThird] = useState(false);
    const onOpenModalThird = () => setOpenThird(true);
    const onCloseModalThird = () => setOpenThird(false);

    const [orderToBeCanceled, setOrderToBeCanceled] = useState(null)

    const [orderToBeFinalized,setOrderToBeFinalized] = useState(null)

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

    const [activeOrders, setActiveOrders] = useState([])

    const [selectedOrder, setSelectedOrder] = useState({})

    useEffect(() => {
        const fetchActiveOrders = async () => {
            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get("https://localhost:44317/api/Orders/GetAllOrders")

                if (response.status !== 200) throw new Error("Error happened when pulling all orders")
                setActiveOrders(response.data.reverse())

            } catch (error) {
                console.log(error.message)
            }
        }
        fetchActiveOrders()
    }, [])

    const cancelOrder = async (orderId) => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.put(`https://localhost:44317/api/Orders/CancelOrder/${orderId}`)

            if (response.status !== 200) throw new Error("Error happened when pulling categories")

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

    const finalizeOrder = async (orderId) => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.put(`https://localhost:44317/api/Orders/FinalizeOrder/${orderId}`)

            if (response.status !== 200) throw new Error("Error happened when pulling categories")

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

    console.log(activeOrders)

    if (!isAuthenticated) {
        return (
            <Navigate to={{pathname: "/login", state: {from: location}}}/>
        )
    } else if(!(role === "OWNER" || role === "EMPLOYEE" || role === "ADMIN")){
        return (
            <Navigate to={{pathname: "/UnauthorizedAccess", state: {from: location}}}/>
        )
    }else{
        return (
            <>
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
                                Order Status
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
                            <th scope="col" className="px-6 py-3">
                                Comment From Employee
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {activeOrders.map((order) => (
                            <tr className="h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={order.id}>
                                <td className="p-10 font-bold text-gray-900 text-base font-semibold">
                                    {order.id}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    {order.username}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {order.comment}
                                </td>
                                <td className={order.orderStatus === "Canceled" ? 'bg-red-400 px-4 py-6 text-gray-900 text-base font-semibold' : order.orderStatus === "Delivered" ?
                                    'bg-green-400 px-4 py-6 text-gray-900 text-base font-semibold' : 'bg-blue-400 px-4 py-6 text-gray-900 text-base font-semibold'}>
                                    {order.orderStatus}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {order.soldFromEmployeeId ? order.soldFromEmployeeId : "None"}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {order.dateCreated}
                                </td>
                                <td className="whitespace-nowrap px-4 py-6 text-gray-900 text-base font-semibold">
                                    {order.totalSum} мкд
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {order.orderAddress}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {order.orderCommentFromEmployee ? order.orderCommentFromEmployee : "None"}
                                </td>
                                <td className="px-6 py-4 flex flex-col gap-2 text-gray-900 text-base font-semibold">
                                    {order.orderStatus !== "Canceled" && order.orderStatus !== "Delivered" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order)
                                                    onOpenModal()
                                                }}
                                                className="w-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                View Products
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onOpenModalSecond()
                                                    setOrderToBeCanceled(order.id)
                                                }}
                                                className="w-36 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Cancel Order
                                            </button>
                                            {role !== "ADMIN" && role !== "BUYER" &&(<button
                                                onClick={() => {
                                                    onOpenModalThird()
                                                    setOrderToBeFinalized(order.id)
                                                }}
                                                className="w-36 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Finalize Order
                                            </button>)}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <Modal open={open} onClose={onCloseModal}>
                    <div className={"container mx-auto mt-6 overflow-auto w-72 sm:w-full"}>
                        <table className="text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                            <thead
                                className="text-sm text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Product ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Product Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Product Image
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Product Quantity
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Product Description
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedOrder && selectedOrder.prodsInOrder && selectedOrder.prodsInOrder.map((productInOrder, productInOrderIndex) => (
                                <tr className="h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    key={productInOrderIndex}>
                                    <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                        {productInOrder.productId}
                                    </td>
                                    <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                        {productInOrder.productName}
                                    </td>
                                    <th scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className={"mx-auto"} src={productInOrder.productImage} alt={productInOrder.productName}
                                             width="50" height="50"/>
                                    </th>
                                    <td className="px-4 py-6 text-gray-900 -base font-semibold">
                                        {productInOrder.productDescription}
                                    </td>
                                    <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                        {productInOrder.quantity} pieces
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>

                <Modal open={openSecond} onClose={onCloseModalSecond}>
                    <div className={"flex justify-center items-center flex-col gap-2"}>
                        <h1 className={"text-xl font-bold"}>
                            Are you sure?
                        </h1>
                        <h1 className={"text-md font-lg underline"}>
                            These changes cannot be reverted.
                        </h1>
                        <button
                            onClick={() => {
                                cancelOrder(orderToBeCanceled)
                            }}
                            className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-red-500 text-lg font-bold text-white">
                            CANCEL ORDER
                            <div
                                className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                        </button>
                    </div>
                </Modal>
                <Modal open={openThird} onClose={onCloseModalThird}>
                    <div className={"flex justify-center items-center flex-col gap-2"}>
                        <h1 className={"text-xl font-bold"}>
                            Are you sure?
                        </h1>
                        <h1 className={"text-md font-lg underline"}>
                            Please double check the order before submitting.
                        </h1>
                        <button
                            onClick={() => {
                                finalizeOrder(orderToBeFinalized)
                            }}
                            className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                            FINALIZE ORDER
                            <div
                                className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                        </button>
                    </div>
                </Modal>
            </>
        )
    }
};

export default ActiveOrders;
