import "../index.css"
import {useEffect, useState} from "react";
import axios from "axios";
import {Modal} from "react-responsive-modal";
import {useAuth} from "../AuthProvider/AuthContext.jsx";
import Swal from "sweetalert2";
import {Navigate} from "react-router-dom";

const SUManagmentPanel = () => {

    const [users, setUsers] = useState([])

    //edit modal
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    //delete modal
    const [openSecond, setOpenSecond] = useState(false);
    const onOpenModalSecond = () => setOpenSecond(true);
    const onCloseModalSecond = () => setOpenSecond(false);

    //Add new user
    const [openThird, setOpenThird] = useState(false);
    const onOpenModalThird = () => setOpenThird(true);
    const onCloseModalThird = () => setOpenThird(false);

    //Add new role modal
    const [openFourth, setOpenFourth] = useState(false);
    const onOpenModalFourth = () => setOpenFourth(true);
    const onCloseModalFourth = () => setOpenFourth(false);

    //Add new product
    const [openFifth, setOpenFifth] = useState(false);
    const onOpenModalFifth = () => setOpenFifth(true);
    const onCloseModalFifth = () => setOpenFifth(false);

    //Edit product
    const [openSixth, setOpenSixth] = useState(false);
    const onOpenModalSixth = () => setOpenSixth(true);
    const onCloseModalSixth = () => setOpenSixth(false);

    //Delete product
    const [openSeventh, setOpenSeventh] = useState(false);
    const onOpenModalSeventh = () => setOpenSeventh(true);
    const onCloseModalSeventh = () => setOpenSeventh(false);

    //Add to warehouse product
    const [openEigth, setOpenEigth] = useState(false);
    const onOpenModalEigth = () => setOpenEigth(true);
    const onCloseModalEigth = () => setOpenEigth(false);

    //Remove product from warehouse
    const [openNinth, setOpenNinth] = useState(false);
    const onOpenModalNinth = () => setOpenNinth(true);
    const onCloseModalNinth = () => setOpenNinth(false);

    //Add category
    const [openTength, setOpenTength] = useState(false);
    const onOpenModalTength = () => setOpenTength(true);
    const onCloseModalTength = () => setOpenTength(false);

    //Edit category
    const [openEleventh, setOpenEleventh] = useState(false);
    const onOpenModalEleventh = () => setOpenEleventh(true);
    const onCloseModalEleventh = () => setOpenEleventh(false);

    //Delete category
    const [openTwelveth, setOpenTwelveth] = useState(false);
    const onOpenModalTwelveth = () => setOpenTwelveth(true);
    const onCloseModalTwelveth = () => setOpenTwelveth(false);

    //Register warehouse
    const [openThirteenth, setOpenThirteenth] = useState(false);
    const onOpenModalThirteenth = () => setOpenThirteenth(true);
    const onCloseModalThirteenth = () => setOpenThirteenth(false);

    const [productName, setProductName] = useState(null)
    const [productDescription, setProductDescription] = useState(null)
    const [categoryId, setCategoryId] = useState(null)
    const [productPrice, setProductPrice] = useState(null)
    const [imageURL, setImageURL] = useState(null)
    const [productPriceForSelling, setProductPriceForSelling] = useState(null)

    const {user, role, isAuthenticated} = useAuth()

    const [roles, setRoles] = useState([])

    const [newUsername, setNewUsername] = useState(null)
    const [newPassword, setNewPassword] = useState(null)

    const [selectedRole, setSelectedRole] = useState(null);

    const [userId, setUserId] = useState(null)

    const [selectedWarehouse, setSelectedWarehouse] = useState(null)

    const [newrole, setNewRole] = useState(null)

    const [employeeRoleId, setEmployeeRoleId] = useState(0);
    const [ownerRoleId, setOwnerRoleId] = useState(0);

    const [warehouses, setWarehouses] = useState([])

    const [categories, setCategories] = useState([])

    const [products, setProducts] = useState([])

    const [productToBeEdited, setProductToBeEdited] = useState(null)

    const [productToBeDeleted, setProductToBeDeleted] = useState(null)

    const [productToBeAddedToWarehouse, setProductToBeAddedToWarehouse] = useState(null)
    const [quantityForAddingToWarehouse, setQuantityForAddingToWarehouse] = useState(0)

    const [productsInWarehouse, setProductsInWarehouse] = useState([])

    const [productToBeDeletedFromWh, setProductToBeDeletedFromWh] = useState(null)

    const [categoryToBeAdded,setCategoryToBeAdded] = useState(null)
    const [categoryToBeEdited,setCategoryToBeEdited] = useState(null)
    const [categoryToBeEditedContent,setCategoryToBeEditedContent] = useState(null)
    const [categoryToBeDeleted,setCategoryToBeDeleted] = useState(null)

    const [warehouseToBeRegistered,setWarehouseToBeRegistered] = useState(null)
    const [warehouseAddressToBeRegistered,setWarehouseAddressToBeRegistered] = useState(null)


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
        const fetchUsers = async () => {
            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get("https://localhost:44317/api/User/AllUsers")

                if (response.status !== 200) throw new Error("Error happened when pulling users")

                setUsers(response.data)

            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchRoles = async () => {
            try {

                const response = await axios.get("https://localhost:44317/api/Roles/Roles")

                if (response.status !== 200) throw new Error("Error happened when pulling roles")
                setRoles(response.data)
                setEmployeeRoleId(response.data.find((role) => role.roleName === "EMPLOYEE").id)
                setOwnerRoleId(response.data.find((role) => role.roleName === "OWNER").id)

            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchWarehouses = async () => {
            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get("https://localhost:44317/api/Warehouse/Warehouses")

                if (response.status !== 200) throw new Error("Error happened when pulling warehouses")

                setWarehouses(response.data)

            } catch (error) {
                console.log(error.message)
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

                if (response.status !== 200) throw new Error("Error happened when pulling categories")

                setCategories(response.data)

            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchProducts = async () => {
            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get("https://localhost:44317/api/Product/Products")

                if (response.status !== 200) throw new Error("Error happened when pulling products")

                setProducts(response.data)

            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchProductsInWarehouse = async () => {
            try {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${getCookie('auth')}`,
                    },
                });

                const response = await axiosInstance.get("https://localhost:44317/api/ProductsInWarehouse/GetProductsFromWarehouse")

                if (response.status !== 200) throw new Error("Error happened when pulling products")

                setProductsInWarehouse(response.data)

            } catch (error) {
                console.log(error.message)
            }
        }
        fetchUsers()
        fetchRoles()
        fetchWarehouses()
        fetchCategories()
        fetchProducts()
        fetchProductsInWarehouse()
    }, [])

    const handleRoleChange = (event) => {
        setSelectedRole(Number(event.target.value));
        setSelectedWarehouse(null)
    };

    const handleWarehouseChange = (event) => {
        setSelectedWarehouse(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value);
    };

    const submitEdit = async (userId) => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.put(`https://localhost:44317/api/User/EditUser/${userId}`, {
                Username: newUsername,
                Password: newPassword,
                RoleId: selectedRole ? selectedRole : null,
                WorksAtWarehouse: selectedWarehouse ? selectedWarehouse : null
            })

            if (response.status !== 200) throw new Error("Error happened when editing user")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const submitDelete = async (userId) => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.delete(`https://localhost:44317/api/User/DeleteUser/${userId}`)

            if (response.status !== 200) throw new Error("Error happened when deleting the user")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const submitRole = async () => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.post(`https://localhost:44317/api/Roles/AddRole`, {
                RoleName: newrole
            })

            if (response.status !== 200) throw new Error("Error happened when submitting the role")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const submitRegister = async () => {
        try {

            const response = await axios.post(`https://localhost:44317/api/User/Register`, {
                Username: newUsername,
                Password: newPassword,
                RoleId: selectedRole ? selectedRole : null,
                WorksAtWarehouse: selectedWarehouse ? selectedWarehouse : null
            })

            if (response.status !== 200) throw new Error("Error happened when registering user")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const submitNewProductRegistration = async () => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.post(`https://localhost:44317/api/Product/RegisterProduct`, {
                ProductName: productName,
                ProductDescription: productDescription,
                CategoryId: categoryId ? categoryId : null,
                ProductPrice: productPrice,
                ImageURL: imageURL,
                ProductPriceForSelling: productPriceForSelling
            })

            if (response.status !== 200) throw new Error("Error happened when registering product")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const submitEditProduct = async (productID) => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.put(`https://localhost:44317/api/Product/EditProduct/${productID}`, {
                ProductName: productName ? productName : null,
                ProductDescription: productDescription ? productDescription : null,
                CategoryId: categoryId ? categoryId : null,
                ProductPrice: productPrice ? productPrice : null,
                ImageURL: imageURL ? productPrice : null,
                ProductPriceForSelling: productPriceForSelling ? productPriceForSelling : null
            })

            if (response.status !== 200) throw new Error("Error happened when editing product")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const submitDeleteProduct = async (productID) => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.delete(`https://localhost:44317/api/Product/DeleteProduct/${productID}`)

            if (response.status !== 200) throw new Error("Error happened when deleting the product")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    const addProductToWarehouse = async () => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.post(`https://localhost:44317/api/ProductsInWarehouse/AddProductToWareHouse`, {
                ProductId: productToBeAddedToWarehouse,
                WarehouseId: selectedWarehouse ? selectedWarehouse : null,
                Quantity: quantityForAddingToWarehouse ? quantityForAddingToWarehouse : null
            })

            if (response.status !== 200) throw new Error("Error happened when deleting the product")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const removeProductFromWarehouse = async (productToBeRemovedFromWarehouseId) => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.delete(`https://localhost:44317/api/ProductsInWarehouse/DeleteProductFromWarehouse/${productToBeRemovedFromWarehouseId}`)

            if (response.status !== 200) throw new Error("Error happened when deleting the product from warehouse")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const registerCategory = async () => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.post(`https://localhost:44317/api/Category/RegisterCategory`, {
                CategoryName : categoryToBeAdded
            })

            if (response.status !== 200) throw new Error("Error happened when registering the category")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const editCategory = async () => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.put(`https://localhost:44317/api/Category/EditCategory/${categoryToBeEdited}`, {
                CategoryName : categoryToBeEditedContent
            })

            if (response.status !== 200) throw new Error("Error happened when registering the category")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const deleteCategory = async () => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.delete(`https://localhost:44317/api/Category/DeleteCategory/${categoryToBeDeleted}`)

            if (response.status !== 200) throw new Error("Error happened when registering the category")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const registerWarehouse = async () => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${getCookie('auth')}`,
                },
            });

            const response = await axiosInstance.post(`https://localhost:44317/api/Warehouse/RegisterWarehouse`,{
                Name : warehouseToBeRegistered,
                Address : warehouseAddressToBeRegistered
            })

            if (response.status !== 200) throw new Error("Error happened when registering the category")

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
            await Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    if (!isAuthenticated) {
        return (
            <Navigate to={{pathname: "/login", state: {from: location}}}/>
        )
    } else if(!(role === "ADMIN" || role === "EMPLOYEE" || role === "OWNER")){
        return (
            <Navigate to={{pathname: "/UnauthorizedAccess", state: {from: location}}}/>
        )
    }else{
        return (
            <>
                <div className={"p-3 flex justify-end flex-col md:flex-row gap-3 content-center mx-auto w-11/12"}>
                    <div className={"container justify-end flex gap-2 flex-col w-44 content-center mx-auto md:flex-row md:w-full"}>
                        {(role === "ADMIN") && (
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        onOpenModalThirteenth()
                                    }}>
                                Add new warehouse
                            </button>)}
                        {role === "ADMIN" && (
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        setNewUsername(null)
                                        setNewPassword(null)
                                        onOpenModalThird()
                                    }}>
                                Add new user
                            </button>)}
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => {
                                    onOpenModalFifth()
                                }}>
                            Add new product
                        </button>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => {
                                    onOpenModalTength()
                                }}>
                            Add new category
                        </button>
                        {role === "ADMIN" && (
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        onOpenModalFourth()
                                    }}>
                                Add new role
                            </button>)}
                    </div>

                    <Modal open={openFifth} onClose={onCloseModalFifth}>
                        <div className={"flex justify-center items-center flex-col gap-2"}>
                            <label>Enter product name:</label>
                            <input type="text"
                                   onChange={(e) => {
                                       setProductName(e.target.value)
                                   }}
                                   id={"newUsername"}
                                   placeholder={"Ex: Chocolate"}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>
                            <label>Enter product description:</label>
                            <input type="text"
                                   onChange={(e) => {
                                       setProductDescription(e.target.value)
                                   }}
                                   id={"newUsername"}
                                   placeholder={"Ex: Chocolate with milk..."}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>
                            <label>Enter product procurement price:</label>
                            <input type="text"
                                   onChange={(e) => {
                                       setProductPrice(e.target.value)
                                   }}
                                   id={"newUsername"}
                                   placeholder={"Ex: 75 мкд"}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>
                            <label>Enter product image URL:</label>
                            <input type="text"
                                   onChange={(e) => {
                                       setImageURL(e.target.value)
                                   }}
                                   id={"newUsername"}
                                   placeholder={"Ex: https://chocolateimg..."}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>
                            <label>Enter product price for selling:</label>
                            <input type="text"
                                   onChange={(e) => {
                                       setProductPriceForSelling(e.target.value)
                                   }}
                                   id={"newUsername"}
                                   placeholder={"Ex: 100 мкд"}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>
                            <select id="roles"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={categoryId == null ? "" : categoryId}
                                    onChange={handleCategoryChange}
                            >
                                <option value={""}>Choose a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.categoryName}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    submitNewProductRegistration()
                                }}
                                className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                                REGISTER PRODUCT
                                <div
                                    className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                            </button>
                        </div>
                    </Modal>

                    <Modal open={openFourth} onClose={onCloseModalFourth}>
                        <div className={"flex justify-center items-center flex-col gap-2"}>
                            <label>Enter new role name:</label>
                            <h1 className={"underline text-red-500 font-bold"}>NOTE: Roles cannot be changed,double
                                check for spelling before submiting.</h1>
                            <input type="text"
                                   onChange={(e) => {
                                       setNewRole(e.target.value)
                                   }}
                                   id={"newUsername"}
                                   placeholder={"Ex: MANAGER"}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>
                            <button
                                onClick={() => {
                                    submitRole()
                                }}
                                className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                                REGISTER ROLE
                                <div
                                    className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                            </button>
                        </div>
                    </Modal>

                    <Modal open={openThird} onClose={onCloseModalThird}>
                        <div className={"flex justify-center flex-col gap-2"}>
                            <label>Enter username:</label>
                            <input type="text"
                                   onChange={(e) => {
                                       setNewUsername(e.target.value)
                                   }}
                                   id={"newUsername"}
                                   placeholder={"Ex: johndoe"}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>
                            <label>Enter password:</label>
                            <input type="password"
                                   onChange={(e) => {
                                       setNewPassword(e.target.value)
                                   }}
                                   id={"newPassword"}
                                   placeholder={"********"}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>

                            <select id="roles"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={selectedRole == null ? "" : selectedRole}
                                    onChange={handleRoleChange}
                            >
                                <option value={""}>Choose a role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.roleName}</option>
                                ))}
                            </select>

                            {((selectedRole === employeeRoleId) || (selectedRole === ownerRoleId)) && (
                                <select id="warehouses"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={selectedWarehouse == null ? "" : selectedWarehouse}
                                        onChange={handleWarehouseChange}
                                >
                                    <option value={""}>Choose a warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                    ))}
                                </select>)}

                            <button
                                onClick={() => {
                                    submitRegister()
                                }}
                                className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                                REGISTER USER
                                <div
                                    className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                            </button>
                        </div>
                    </Modal>
                </div>

                {(role === "ADMIN" || role === "OWNER") && (
                    <div
                        className="flex flex-col justify-center overflow-auto container mx-auto w-11/12 border-solid border-2 rounded-lg drop-shadow-lg mb-5">
                        <h1 className={"text-2xl font-bold p-3 mx-auto"}>Warehouses Data:</h1>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                            <thead className="text-sm text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Warehouse ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Warehouse name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Address
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {warehouses.map((wh) => (
                                <tr className={"h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700"}
                                    key={wh.id}>
                                    <td className="px-4 py-6 font-bold text-gray-900 text-base font-semibold">
                                        {wh.id}
                                    </td>
                                    <td className="px-4 py-6 font-bold text-gray-900 text-base font-semibold">
                                        {wh.name}
                                    </td>
                                    <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                        {wh.address}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <Modal open={openThirteenth} onClose={onCloseModalThirteenth}>
                            <div className={"flex justify-center items-center flex-col gap-2 m-5"}>
                                <label>Enter new warehouse name:</label>
                                <input type="text"
                                       onChange={(e) => {
                                           setWarehouseToBeRegistered(e.target.value)
                                       }}
                                       id={"newWarehouse"}
                                       placeholder={"Ex: WarehouseName"}
                                       className="border rounded-lg px-3 py-2 text-sm w-full"/>
                                <label>Enter new warehouse address:</label>
                                <input type="text"
                                       onChange={(e) => {
                                           setWarehouseAddressToBeRegistered(e.target.value)
                                       }}
                                       id={"newWarehouseAddress"}
                                       placeholder={"Ex: Address,#1,Country,State"}
                                       className="border rounded-lg px-3 py-2 text-sm w-full"/>
                                <button
                                    onClick={() => {
                                        registerWarehouse()
                                    }}
                                    className=" sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-md font-bold text-white">
                                    REGISTER WAREHOUSE
                                    <div
                                        className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                </button>
                            </div>
                        </Modal>
                    </div>
                )}

                {(role === "ADMIN" || role === "OWNER" || role === "EMPLOYEE") && (
                    <div
                        className="flex flex-col justify-center overflow-auto container mx-auto w-11/12 border-solid border-2 rounded-lg drop-shadow-lg mb-5">
                        <h1 className={"text-2xl font-bold p-3 mx-auto"}>Categories Data:</h1>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                            <thead className="text-sm text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Category ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {categories.map((cat) => (
                                <tr className={"h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700"}
                                    key={cat.id}>
                                    <td className="px-4 py-6 font-bold text-gray-900 text-base font-semibold">
                                        {cat.id}
                                    </td>
                                    <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                        {cat.categoryName}
                                    </td>
                                    <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                        <>
                                            <button
                                                onClick={() => {
                                                    setCategoryToBeEdited(cat.id)
                                                    onOpenModalEleventh()
                                                }}
                                                className="mb-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCategoryToBeDeleted(cat.id)
                                                    onOpenModalTwelveth()
                                                }}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                                Delete
                                            </button>
                                        </>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <Modal open={openTength} onClose={onCloseModalTength}>
                            <div className={"flex justify-center flex-col gap-2"}>
                                <label>Enter category name:</label>
                                <input type="text"
                                       onChange={(e) => {
                                           setCategoryToBeAdded(e.target.value)
                                       }}
                                       id={"newCategory"}
                                       placeholder={"Ex: Sweets"}
                                       className="border rounded-lg px-3 py-2 text-sm w-full"/>
                                <button
                                    onClick={() => {
                                        registerCategory()
                                    }}
                                    className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                                    REGISTER CATEGORY
                                    <div
                                        className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                </button>
                            </div>
                        </Modal>
                        <Modal open={openEleventh} onClose={onCloseModalEleventh}>
                            <div className={"flex justify-center flex-col gap-2"}>
                                <label>Edit category:</label>
                                <input type="text"
                                       onChange={(e) => {
                                           setCategoryToBeEditedContent(e.target.value)
                                       }}
                                       id={"newCategory"}
                                       placeholder={"Ex: Sweets"}
                                       className="border rounded-lg px-3 py-2 text-sm w-full"/>
                                <button
                                    onClick={() => {
                                        editCategory()
                                    }}
                                    className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                                    REGISTER CHANGES
                                    <div
                                        className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                </button>
                            </div>
                        </Modal>
                        <Modal open={openTwelveth} onClose={onCloseModalTwelveth}>
                            <div className={"flex justify-center items-center flex-col gap-2"}>
                                <h1 className={"text-xl font-bold"}>
                                    Are you sure?
                                </h1>
                                <h1 className={"text-md font-lg underline"}>
                                    This will permanently delete the selected category.
                                </h1>
                                <button
                                    onClick={() => {
                                        deleteCategory()
                                    }}
                                    className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-red-500 text-lg font-bold text-white">
                                    DELETE
                                    <div
                                        className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                </button>
                            </div>
                        </Modal>
                    </div>
                )}

                {role === "ADMIN" && (
                    <div
                    className="flex flex-col justify-center overflow-auto container mx-auto w-11/12 border-solid border-2 rounded-lg drop-shadow-lg">
                    <h1 className={"text-2xl font-bold p-3 mx-auto"}>Users Data:</h1>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                        <thead className="text-sm text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                User ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Works At
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((incomingUser) => (
                            <tr className={user === incomingUser.username ? "h-25 bg-zinc-200 border-b dark:bg-gray-800 dark:border-gray-700" : "h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700"}
                                key={incomingUser.id}>
                                <td className="p-10 font-bold text-gray-900 text-base font-semibold">
                                    {incomingUser.id}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    {incomingUser.username === user ? `${incomingUser.username} (this is you)` : incomingUser.username}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {incomingUser.worksAtWarehouse === null ? "None" : incomingUser.worksAtWarehouse}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {incomingUser.roleName}
                                </td>
                                <td className="px-6 py-4 text-gray-900 text-base font-semibold">
                                    <>
                                        <button
                                            onClick={() => {
                                                setNewUsername(null)
                                                setNewPassword(null)
                                                setUserId(incomingUser.id)
                                                onOpenModal()
                                            }}
                                            className="mb-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setUserId(incomingUser.id)
                                                onOpenModalSecond()
                                            }}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                            Delete
                                        </button>
                                    </>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Modal open={open} onClose={onCloseModal}>
                        <div className={"flex justify-center flex-col gap-2"}>
                            <label>Enter new username:</label>
                            <input type="text"
                                   onChange={(e) => {
                                       setNewUsername(e.target.value)
                                   }}
                                   id={"newUsername"}
                                   placeholder={"Ex: johndoe"}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>
                            <label>Enter new password:</label>
                            <input type="password"
                                   onChange={(e) => {
                                       setNewPassword(e.target.value)
                                   }}
                                   id={"newPassword"}
                                   placeholder={"********"}
                                   className="border rounded-lg px-3 py-2 text-sm w-full"/>

                            <select id="roles"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={selectedRole == null ? "" : selectedRole}
                                    onChange={handleRoleChange}
                            >
                                <option value={""}>Choose a role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.roleName}</option>
                                ))}
                            </select>

                            {((selectedRole === employeeRoleId) || (selectedRole === ownerRoleId)) && (
                                <select id="warehouses"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={selectedWarehouse == null ? "" : selectedWarehouse}
                                        onChange={handleWarehouseChange}
                                >
                                    <option value={""}>Choose a warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                    ))}
                                </select>)}

                            <button
                                onClick={() => {
                                    submitEdit(userId)
                                }}
                                className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                                CONFIRM CHANGES
                                <div
                                    className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                            </button>
                        </div>
                    </Modal>

                    <Modal open={openSecond} onClose={onCloseModalSecond}>
                        <div className={"flex justify-center items-center flex-col gap-2"}>
                            <h1 className={"text-xl font-bold"}>
                                Are you sure?
                            </h1>
                            <h1 className={"text-md font-lg underline"}>
                                This will permanently delete the selected user.
                            </h1>
                            <button
                                onClick={() => {
                                    submitDelete(userId)
                                }}
                                className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-red-500 text-lg font-bold text-white">
                                DELETE
                                <div
                                    className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                            </button>
                        </div>
                    </Modal>
                </div>)}

                <div
                    className="mt-5 mb-10 flex flex-col justify-center container overflow-auto mx-auto w-11/12 border-solid border-2 rounded-lg drop-shadow-lg">
                    <h1 className={"text-2xl font-bold p-3 mx-auto"}>Products Data:</h1>
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
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product Image
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product Procurement Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product Price For Selling
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr className={"h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700"}
                                key={product.id}>
                                <td className="p-10 font-bold text-gray-900 text-base font-semibold">
                                    {product.id}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    {product.productName}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {product.productDescription}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {product.category === null ? "None" : product.category.categoryName}
                                </td>
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <img className={"mx-auto"} src={product.productImageURL} alt={product.productName}
                                         width="50" height="50"/>
                                </th>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    {product.productPrice} мкд
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    {product.productPriceForSelling} мкд
                                </td>
                                <td className="flex flex-col md:flex-row gap-2 px-6 py-4 text-gray-900 text-base font-semibold">
                                    <>
                                        <button
                                            onClick={() => {
                                                onOpenModalSixth()
                                                setProductToBeEdited(product.id)
                                            }}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                onOpenModalSeventh()
                                                setProductToBeDeleted(product.id)
                                            }}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => {
                                                onOpenModalEigth()
                                                setProductToBeAddedToWarehouse(product.id)
                                            }}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                            Add To Warehouse
                                        </button>
                                    </>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Modal open={openSixth} onClose={onCloseModalSixth}>
                    <div className={"flex justify-center items-center flex-col gap-2"}>
                        <label>Enter new product name:</label>
                        <input type="text"
                               onChange={(e) => {
                                   setProductName(e.target.value)
                               }}
                               id={"newUsername"}
                               placeholder={"Ex: Chocolate"}
                               className="border rounded-lg px-3 py-2 text-sm w-full"/>
                        <label>Enter new product description:</label>
                        <input type="text"
                               onChange={(e) => {
                                   setProductDescription(e.target.value)
                               }}
                               id={"newUsername"}
                               placeholder={"Ex: Chocolate with milk..."}
                               className="border rounded-lg px-3 py-2 text-sm w-full"/>
                        <label>Enter new product procurement price:</label>
                        <input type="number"
                               onChange={(e) => {
                                   setProductPrice(e.target.value)
                               }}
                               placeholder={"Ex: 75 мкд"}
                               className="border rounded-lg px-3 py-2 text-sm w-full"/>
                        <label>Enter new product image URL:</label>
                        <input type="text"
                               onChange={(e) => {
                                   setImageURL(e.target.value)
                               }}
                               id={"newUsername"}
                               placeholder={"Ex: https://chocolateimg..."}
                               className="border rounded-lg px-3 py-2 text-sm w-full"/>
                        <label>Enter new product price for selling:</label>
                        <input type="number"
                               onChange={(e) => {
                                   setProductPriceForSelling(e.target.value)
                               }}
                               placeholder={"Ex: 100 мкд"}
                               className="border rounded-lg px-3 py-2 text-sm w-full"/>
                        <select id="roles"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={categoryId == null ? "" : categoryId}
                                onChange={handleCategoryChange}
                        >
                            <option value={""}>Choose a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.categoryName}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                submitEditProduct(productToBeEdited)
                            }}
                            className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                            CONFIRM CHANGES
                            <div
                                className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                        </button>
                    </div>
                </Modal>

                <Modal open={openSeventh} onClose={onCloseModalSeventh}>
                    <div className={"flex justify-center items-center flex-col gap-2"}>
                        <h1 className={"text-xl font-bold"}>
                            Are you sure?
                        </h1>
                        <h1 className={"text-md font-lg underline"}>
                            This will permanently delete the selected product.
                        </h1>
                        <button
                            onClick={() => {
                                submitDeleteProduct(productToBeDeleted)
                            }}
                            className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-red-500 text-lg font-bold text-white">
                            DELETE
                            <div
                                className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                        </button>
                    </div>
                </Modal>

                <Modal open={openEigth} onClose={onCloseModalEigth}>
                    <div className={"flex p-5 justify-center flex-col gap-2"}>
                        <select id="warehouses"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={selectedWarehouse == null ? "" : selectedWarehouse}
                                onChange={handleWarehouseChange}
                        >
                            <option value={""}>Choose a warehouse</option>
                            {warehouses.map((warehouse) => (
                                <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                            ))}
                        </select>
                        <label>Enter quantity:</label>
                        <input type="text"
                               onChange={(e) => {
                                   setQuantityForAddingToWarehouse(e.target.value)
                               }}
                               id={"newUsername"}
                               placeholder={"Ex: 1000"}
                               className="border rounded-lg px-3 py-2 text-sm w-full"/>
                        <button
                            onClick={() => {
                                addProductToWarehouse()
                            }}
                            className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                            CONFIRM CHANGES
                            <div
                                className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                        </button>
                    </div>
                </Modal>

                {/*lastdata*/}
                <div
                    className="mt-5 mb-10 flex flex-col justify-center container overflow-auto mx-auto w-11/12 border-solid border-2 rounded-lg drop-shadow-lg">
                    <h1 className={"text-2xl font-bold p-3 mx-auto"}>Products in Warehouse Data:</h1>
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
                                Product Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product Image
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Current Product Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Last Received By
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {productsInWarehouse.map((product) => (
                            <tr className={"h-25 bg-white border-b dark:bg-gray-800 dark:border-gray-700"}
                                key={product.id}>
                                <td className="p-10 font-bold text-gray-900 text-base font-semibold">
                                    {product.id}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    {product.productName}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {product.productDescription}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-semibold">
                                    {product.productPrice} мкд
                                </td>
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <img className={"mx-auto"} src={product.productImageUrl} alt={product.productName}
                                         width="50" height="50"/>
                                </th>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    {product.productQuantity} pieces
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    {product.receivedBy}
                                </td>
                                <td className="px-4 py-6 text-gray-900 text-base font-bold">
                                    <button
                                        onClick={() => {
                                            onOpenModalNinth()
                                            setProductToBeDeletedFromWh(product.id)
                                        }}
                                        className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-red-500 text-lg font-bold text-white">
                                        DELETE
                                        <div
                                            className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Modal open={openNinth} onClose={onCloseModalNinth}>
                    <div className={"flex justify-center items-center flex-col gap-2"}>
                        <h1 className={"text-xl font-bold"}>
                            Are you sure?
                        </h1>
                        <h1 className={"text-md text-center font-lg underline"}>
                            This will permanently delete the selected product from the warehouse.
                        </h1>
                        <button
                            onClick={() => {
                                removeProductFromWarehouse(productToBeDeletedFromWh)
                            }}
                            className="sm:100 group relative h-12 w-48 overflow-hidden rounded-2xl bg-red-500 text-lg font-bold text-white">
                            DELETE
                            <div
                                className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                        </button>
                    </div>
                </Modal>
            </>
        )
    }
}

export default SUManagmentPanel