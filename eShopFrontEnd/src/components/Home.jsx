import '../index.css'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../AuthProvider/AuthContext.jsx";

const Home = () => {

    const {isAuthenticated} = useAuth()

    const navigate = useNavigate();

    return(
        <section className="m-5 flex items-center min-h-screen justify-center rounded-3xl bg-gray-200">
            <div className="p-5 bg-white mx-auto max-w-[43rem] rounded-3xl">
                <div className="text-center">
                    <p className="text-2xl font-medium leading-8 text-slate-800 p-1">Introducing <span className={"font-bold"}>Company Name</span></p>
                    <div className={"bg-slate-800 rounded-3xl"}>
                        <img className={"p-8"} src={"https://png.pngtree.com/png-clipart/20220213/original/pngtree-e-letter-logo-ecommerce-shop-store-design-png-image_7265997.png"}/>
                    </div>
                    <h1 className="mt-3 lg:text-[3.5rem] font-bold leading-[4rem] tracking-tight text-black">Distribute
                        your brand from&nbsp;local store to an online e-commerce wholesale application</h1>
                    <p className="mt-3 lg:text-lg leading-relaxed text-slate-400">Our system helps you convert your
                    business to an online place for connecting with customers for wholesale purchases of goods.</p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                    {!isAuthenticated && (
                        <a href="#"
                           onClick={() => {
                               navigate("/login")
                           }}
                           className="transform rounded-md bg-indigo-600/95 px-5 py-3 font-medium text-white transition-colors hover:bg-indigo-700">Proceed To Sign in Page</a>
                    )}
                </div>
            </div>
        </section>
    )
}


export default Home