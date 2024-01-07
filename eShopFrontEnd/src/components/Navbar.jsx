import {Fragment, useEffect, useState} from 'react'
import {Disclosure, Menu, Transition} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import {useAuth} from "../AuthProvider/AuthContext.jsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Navbar() {

    const location = useLocation()

    const {isAuthenticated, setIsAuthenticated, user , role} = useAuth()
    const navigate = useNavigate();
    const [quantityInSc, setQuantityInSc] = useState(0)

    const [navigation, setNavigation] = useState(() => {
        return [
            {name: 'Home', href: '/', current: location.pathname === "/"},
            {name: 'Products', href: '/products', current: location.pathname === "/products"},
            {name: 'About Us', href: '/aboutus', current: location.pathname === "/aboutus"},
            {name: 'Sign In', href: '/login', current: location.pathname === "/login"},
            {name: 'Sign Up', href: '/signup', current: location.pathname === "/signup"},
        ]
    });

    const handleLinkClick = (clickedIndex) => {
        const updatedNavigation = navigation.map((item, index) => ({
            ...item,
            current: index === clickedIndex,
        }));

        setNavigation(updatedNavigation);
    };

    const removeCurrentFromNavigation = () => {
        const updatedNavigation = navigation.map((item ) => ({
            ...item,
            current: false,
        }));

        setNavigation(updatedNavigation);
    };


    function getAndDeleteCookie(cookieName) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === cookieName) {
                const cookieValue = decodeURIComponent(value);
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                return cookieValue;
            }
        }
        return null;
    }

    const handleLogout = async () => {
        getAndDeleteCookie('auth')
        getAndDeleteCookie('expdate')
        getAndDeleteCookie('user')
        getAndDeleteCookie('role')
        setIsAuthenticated(false) // works
        setQuantityInSc(0) //works
        navigate('/login')
    }

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

                if (response.status !== 200) throw new Error("Error happened when pulling products")

                const quantity = response.data.quantity

                setQuantityInSc(quantity)

            } catch (error) {
                console.log(error.message)
            }
        }
        fetchQuantity()
    }, [user])


    return (
        <Disclosure as="nav" className="bg-gray-800 sticky z-50">
            {({open}) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button
                                    className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="absolute -inset-0.5"/>
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="h-8"
                                        src="https://png.pngtree.com/png-clipart/20220213/original/pngtree-e-letter-logo-ecommerce-shop-store-design-png-image_7265997.png"
                                        alt="Dominion.mk"
                                    />
                                </div>


                                <div className="hidden sm:ml-6 sm:block ">
                                    <div className="flex space-x-4">
                                        {navigation.map((item, index) => (
                                            (isAuthenticated && (item.name === 'Sign In' || item.name === 'Sign Up')) ? null : (
                                                <Link
                                                    onClick={() => handleLinkClick(index)}
                                                    key={item.name}
                                                    to={item.href}
                                                    className={classNames(
                                                        location.pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>


                            {isAuthenticated && (
                                <div className={"flex flex-nowrap gap-3 items-center"}>
                                    <button className={"relative p-3 mt-2"} onClick={() => {
                                        navigation.map((key) => {
                                            key.current = false
                                        })
                                        navigate('/shoppingcart')
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
                                        </svg>
                                        <span
                                            className="absolute -top-0 left-8 rounded-full bg-red-500 p-0.5 px-2 text-sm text-red-50">{quantityInSc}</span>
                                    </button>

                                    <Menu as="div" className="relative">
                                        <div>
                                            <Menu.Button
                                                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="absolute -inset-1.5"/>
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                                                    alt=""
                                                />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items
                                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

                                                <Menu.Item>
                                                    <span className={"ml-3"}>Username: <span className={"ml-3 font-bold italic"}>{user}</span></span>
                                                </Menu.Item>

                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            onClick={() => {
                                                                removeCurrentFromNavigation()
                                                                navigate("/orders")
                                                            }}
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            My Orders
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                {(role === "ADMIN" || role === "OWNER" || role === "EMPLOYEE") &&(
                                                    <Menu.Item>
                                                        {({active}) => (
                                                            <a
                                                                onClick={() => {
                                                                    removeCurrentFromNavigation()
                                                                    navigate("/ManagmentPanel")
                                                                }}
                                                                href="#"
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                            >
                                                                Managment Panel
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                )}
                                                {(role === "ADMIN" || role === "OWNER") &&(
                                                    <Menu.Item>
                                                        {({active}) => (
                                                            <a
                                                                onClick={() => {
                                                                    removeCurrentFromNavigation()
                                                                    navigate("/Statistics")
                                                                }}
                                                                href="#"
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                            >
                                                                Statistics
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                )}
                                                {(role === "ADMIN" || role === "OWNER" || role === "EMPLOYEE") &&(
                                                    <Menu.Item>
                                                        {({active}) => (
                                                            <a
                                                                onClick={() => {
                                                                    removeCurrentFromNavigation()
                                                                    navigate("/ActiveOrders")
                                                                }}
                                                                href="#"
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                            >
                                                                All Orders
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                )}
                                                {(role === "ADMIN" || role === "OWNER" || role === "EMPLOYEE") &&(
                                                    <Menu.Item>
                                                        {({active}) => (
                                                            <a
                                                                onClick={() => {
                                                                    removeCurrentFromNavigation()
                                                                    navigate("/ReceivedGoods")
                                                                }}
                                                                href="#"
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                            >
                                                                Received Goods Logs
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                )}
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            onClick={() => {
                                                                removeCurrentFromNavigation()
                                                                handleLogout()
                                                            }}
                                                            href="#"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Sign out
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            )}
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                (isAuthenticated && (item.name === 'Sign In' || item.name === 'Sign Up')) ? null : (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                )
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}
