import '../index.css'
import {useEffect, useState} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Signup = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [allRoles, setAllRoles] = useState([])
    //const {setIsAuthenticated, setUser, setRole, } = useAuth()
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const alertForPasswordChange = () => {
        Swal.fire({
            position: 'top-end',
            icon: 'info',
            title: "Please contact the owner for credentials change.",
            showConfirmButton: false,
            timer: 1500
        })
    }

    useEffect(() => {
        const fetchRoles = async () => {
            try {

                const response = await axios.get("https://localhost:44317/api/Roles/Roles")

                if (response.status !== 200) throw new Error("Error happened when pulling products")

                setAllRoles(response.data)

            } catch (error) {
                console.log(error.message)
            }
        }
        fetchRoles()
    }, [])

    const handleSignUp = async () => {
        event.preventDefault()

        try {
            const response = await axios.post("https://localhost:44317/api/User/Register", {
                Username : username,
                Password : password,
                RoleId : allRoles.find(role => role.roleName === "BUYER").id
            });

            if (!response.status === 200) throw new Error("An error was found.")

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                navigate('/login')
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

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
            <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                <h1 className="font-bold text-center text-2xl mb-5">Sign up for our service</h1>
                <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                    <div className="px-5 py-7">
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">Username</label>
                        <input type="text" onChange={handleUsernameChange}
                               className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"/>
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
                        <input type="password" onChange={handlePasswordChange}
                               className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"/>
                        <button type="button"
                                onClick={handleSignUp}
                                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
                            <span className="inline-block mr-2">Sign up</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" className="w-4 h-4 inline-block">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </button>
                    </div>
                    <div className="py-5">
                        <div className="grid grid-cols-2 gap-1">
                            <div className="text-center sm:text-left whitespace-nowrap">
                                <button
                                    onClick={alertForPasswordChange}
                                    className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                                    </svg>
                                    <span className="inline-block ml-1">Forgot Password</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup