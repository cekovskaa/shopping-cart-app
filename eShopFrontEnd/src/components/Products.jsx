import "../index.css"
import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {useAuth} from "../AuthProvider/AuthContext.jsx";
import {Modal} from "react-responsive-modal";

const Products = () => {

    const [prodsInWh, setProdsInWh] = useState([]);

    const {isAuthenticated} = useAuth()

    const [productQuantity, setProductQuantity] = useState(0)
    const [productToBeAddedToSCId,setproductToBeAddedToSCId] = useState(null)

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    const [searchQuery, setSearchQuery] = useState(null)

    const fetchFilteredProds = async () => {
        try {
            const response = await axios.get(`https://localhost:44317/api/ProductsInWarehouse/FilterProductsFromWarehouseByString?q=${searchQuery}`)

            if (response.status !== 200) throw new Error("Error happened when pulling products")

            setProdsInWh(response.data)

        } catch (error) {
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const [categoryId, setCategoryId] = useState(null)
    const [categories,setCategories] = useState([])

    const fetchFilteredProdsByCategory = async () => {
        try {
            let url = ''
            if(categoryId === null){
                url = "https://localhost:44317/api/ProductsInWarehouse/FilterProductsFromWarehouseByCategory"
            }else{
                url = `https://localhost:44317/api/ProductsInWarehouse/FilterProductsFromWarehouseByCategory?id=${categoryId}`
            }

            const response = await axios.get(url)

            if (response.status !== 200) throw new Error("Error happened when pulling products")

            setProdsInWh(response.data)

        } catch (error) {
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://localhost:44317/api/ProductsInWarehouse/GetProductsFromWarehouse")

                if (response.status !== 200) throw new Error("Error happened when pulling products")

                setProdsInWh(response.data)

            } catch (error) {
                console.log(error.response.data.message)
            }
        }
        const fetchCategories = async () => {
            try {

                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get("https://localhost:44317/api/Category/Categories")

                if (response.status !== 200) throw new Error("Error happened when pulling products")
                setCategories(response.data)

            } catch (error) {
                console.log(error.response.data.message)
            }
        }
        fetchProducts()
        fetchCategories()
    }, [])

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

    const addProductToShoppingCart = async (productId, productQuantity) => {
        try {

            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.post(`https://localhost:44317/api/ProductInShoppingCart/AddProductToShoppingCart`, {
                ProductId: productId,
                Quantity: productQuantity
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
            console.log(error.response.data)
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    return (
        <>
            <div className={"flex justify-center items-center mt-5 sticky"}>
                <div className={"w-10/12 md:w-8/12"}>
                    <label htmlFor="default-search"
                           className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="search" onChange={(e) => {
                            setSearchQuery(e.target.value)
                        }} id="default-search"
                               className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Seach products..." required/>
                        <button type="submit" onClick={() => {
                            fetchFilteredProds()
                        }}
                                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                        </button>
                    </div>
                </div>
            </div>

            <div className={"flex justify-center content-center mt-5 sticky"}>
                <div className={"w-10/12 md:w-8/12 flex justify-center gap-2"}>
                    <select id="categories"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={categoryId == null ? "" : categoryId}
                            onChange={handleCategoryChange}
                    >
                        <option value={""}>Choose a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.categoryName}</option>
                        ))}
                    </select>
                    <button type="submit" onClick={() => {
                        fetchFilteredProdsByCategory()
                    }}
                            className="text-white right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Filter
                    </button>
                </div>
            </div>


            <div className={"mx-auto px-7 container grid gap-x-10 gap-y-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5 mb-5"}>
                {prodsInWh.map((product, index) =>
                    <div key={index} className="card">
                        <div
                            className="outline outline-gray-800 outline-1 bg-white drop-shadow-2xl rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700">
                            <a href="#">
                                <img className="rounded-t-lg p-8 object-contain h-40 md:h-48 lg:h-56 xl:h-64 w-full"
                                     src={product.productImageUrl} alt="product image"/>
                            </a>
                            <div className="px-5 pb-5">
                                <h3 className="text-gray-900 font-semibold text-3xl tracking-tight dark:text-white text-center">{product.productName}</h3>
                                <div className="flex items-center justify-between flex-col gap-1 mt-2">
                                    <span
                                        className="text-xl font-bold text-white dark:text-white bg-green-700 p-3 rounded-2xl">{product.productPrice} мкд</span>
                                    <h6><span
                                        className="text-lg font-light text-gray-900 dark:text-white">{product.productDescription}</span>
                                    </h6>
                                    {isAuthenticated && (
                                        <>
                                            <button
                                               onClick={() => {
                                                   setproductToBeAddedToSCId(product.id)
                                                   onOpenModal()
                                               }}
                                               className="mb-2 text-white bg-cyan-800 hover:bg-cyan-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add
                                                to cart</button>
                                            <Modal open={open} onClose={onCloseModal}>
                                                <div
                                                    className={"w-11/12 mt-5 border-solid border-2 rounded-lg drop-shadow-md mx-auto flex justify-center items-center p-3 gap-2 flex-col mb-3"}>
                                                    <label>Enter quantity for the selected product:</label>
                                                    <input type="text"
                                                           onChange={(e) => {
                                                               setProductQuantity(e.target.value)
                                                           }}
                                                           id={"quantity"}
                                                           placeholder={"Ex: 10"}
                                                           className="border rounded-lg px-3 py-2 text-sm w-full"/>
                                                    <button
                                                        onClick={() => {
                                                            addProductToShoppingCart(productToBeAddedToSCId, productQuantity)
                                                        }}
                                                        className="sm:100 relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                                                        Confirm
                                                        <div
                                                            className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                                    </button>
                                                </div>
                                            </Modal>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Products