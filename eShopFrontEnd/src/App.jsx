import './App.css'
import Navbar from "./components/Navbar.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Login.jsx";
import Home from "./components/Home";
import Products from "./components/Products.jsx";
import ShoppingCart from "./components/ShoppingCart.jsx";
import Signup from "./components/Signup.jsx";
import Orders from "./components/Orders.jsx";
import SUManagmentPanel from "./components/SUManagmentPanel.jsx";
import ActiveOrders from "./components/ActiveOrders.jsx";
import ForbiddenAccess from "./components/ForbiddenAccessComponent/ForbiddenAccess.jsx";
import ReceivedGoods from "./components/ReceivedGoods.jsx";
import Statistics from "./components/Statistics";
import AboutUs from "./components/AboutUs.jsx";

function App() {
    return (
        <>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path={"/"} element={<Home/>}></Route>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"/products"} element={<Products/>}></Route>
                    <Route path={"/shoppingcart"} element={<ShoppingCart/>}></Route>
                    <Route path={"/signup"} element={<Signup/>}></Route>
                    <Route path={"/orders"} element={<Orders/>}></Route>
                    <Route path={"/ManagmentPanel"} element={<SUManagmentPanel/>}></Route>
                    <Route path={"/ActiveOrders"} element={<ActiveOrders/>}></Route>
                    <Route path={"/UnauthorizedAccess"} element={<ForbiddenAccess/>}></Route>
                    <Route path={"/ReceivedGoods"} element={<ReceivedGoods/>}></Route>
                    <Route path={"/Statistics"} element={<Statistics/>}></Route>
                    <Route path={"/aboutus"} element={<AboutUs/>}></Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
