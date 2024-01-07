import '../index.css'
import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from 'react-responsive-modal';


const ShoppingCart = () => {


    const [prodsInSc, setProdsInSc] = useState([])
    const [totalPrice,setTotalPrice] = useState(0)

    const [open, setOpen] = useState(false);

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
        const fetchQuantity = async () => {
            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get("https://localhost:44317/api/ProductInShoppingCart/GetAllProductsInShoppingCart")

                if(response.status !== 200) throw new Error("Error happened when pulling products")

                setProdsInSc(response.data.products)
                setTotalPrice(response.data.totalPrice)


            }catch (error){
                console.log(error.message)
            }
        }
        fetchQuantity()
    },[])

    const confirmOrder = async () => {
        try {

            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.post("https://localhost:44317/api/Orders/CreateOrder",{
                Comment : document.getElementById("comment").value,
                PhoneNumber : document.getElementById("phoneNumber").value,
                DeliveryAddress : document.getElementById("deliveryAddress").value
            })

            if(response.status !== 200) throw new Error("Error happened when creating order")

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.reload()
            })


        }catch (error){
             Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const removeProductFromShoppingCart = async (productId) => {
        try {

            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.delete(`https://localhost:44317/api/ProductInShoppingCart/DeleteProductFromShoppingCart?ProductId=${productId}`)

            if(response.status !== 200) throw new Error("Error happened when pulling products")

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.reload()
            })


        }catch (error){
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    return (
        <>
            <div className={"container w-10/12 flex justify-between content-center flex-wrap mt-5 mx-auto"}>
                <h6 className={"text-3xl font-light"}>Your Shopping Cart</h6>
                <h6 className={"text-3xl font-light"}>Total Price: <span className={"text-3xl font-mono font-extrabold italic"}>{parseFloat(totalPrice).toFixed(2)}</span> мкд</h6>
                <button
                    onClick={onOpenModal}
                    className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                    Confirm Order
                    <div
                        className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                </button>
            </div>

            <div className="container overflow-auto mx-auto w-11/12 mt-5 border-solid border-2 rounded-lg drop-shadow-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                    <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Product image
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {prodsInSc.map((product) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product.id}>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <img className={"mx-auto"} src={product.productImage} alt={product.productName} width="50" height="50" /> {/* Adjust width and height */}
                            </th>
                            <td className="px-6 py-4 font-bold text-gray-900 text-xl font-mono">
                                {product.productName}
                            </td>
                            <td className="px-6 py-4 text-gray-900 text-xl font-mono">
                                {product.productDescription}
                            </td>
                            <td className="px-6 py-4 text-gray-900 text-xl font-mono">
                                {product.quantity}
                            </td>
                            <td className="px-6 py-4 text-gray-900 text-xl font-mono">
                                {product.productPrice} мкд
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => {removeProductFromShoppingCart(product.id)
                                    }}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/*here is the modal*/}
                <Modal open={open} onClose={onCloseModal} center>
                    <div className={"w-11/12 mt-5 border-solid border-2 rounded-lg drop-shadow-md mx-auto flex justify-center items-center p-3 gap-2 flex-col mb-3"}>
                        <label>Enter a comment for the order:</label>
                        <input type="text"
                               id={"comment"}
                               placeholder={"Ex: Order For John Doe"}
                               className="border rounded-lg px-3 py-2 text-sm w-full"/>
                        <label>Enter your phone number:</label>
                        <input type="text"
                               id={"phoneNumber"}
                               placeholder={"Ex: +38978123456"}
                               className="border rounded-lg px-3 py-2 text-sm w-full"/>
                        <label>Enter your current address:</label>
                        <input type="text"
                               id={"deliveryAddress"}
                               placeholder={"Ex: Street Name, #18, Country Name, Zip Code"}
                               className="border rounded-lg px-3 py-2 text-sm w-full"/>
                        <button
                            onClick={confirmOrder}
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

export default ShoppingCart