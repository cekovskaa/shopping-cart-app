import '../../index.css'
import UnauthorizedAccess from '../../assets/UnauthorizedAccess.png'

import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const ForbiddenAccess = () => {

    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('bg-orange-500');
        return () => {
            document.body.classList.remove('bg-orange-500');
        };
    }, []);

    return (
        <div className={"container flex flex-col justify-center items-center gap-2 p-5"}>
            <img className={"rounded-2xl"} src={UnauthorizedAccess}/>
            <button
                onClick={() => {
                    navigate("/")
                }}
                className="group relative h-16 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                Go to Home Page
                <div
                    className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
        </div>
    )
}

export default ForbiddenAccess