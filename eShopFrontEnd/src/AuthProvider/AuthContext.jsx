import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const getTokenValidityFromCookie = () => {

    const cookies = document.cookie.split("; ").reduce((acc, value) => {
        const [key, val] = value.split("=")
        acc[key] = val
        return acc
    }, {})

    if(!cookies.auth || !cookies.expdate) return false

    return Date.now() < cookies.expdate
}

const getUserFromCookie = () => {

    const cookies = document.cookie.split("; ").reduce((acc, value) => {
        const [key, val] = value.split("=")
        acc[key] = val
        return acc
    }, {})

    return cookies.user || null
}

const getRoleFromCookie = () => {

    const cookies = document.cookie.split("; ").reduce((acc, value) => {
        const [key, val] = value.split("=")
        acc[key] = val
        return acc
    }, {})

    return cookies.role || null
}

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(getTokenValidityFromCookie);

    const [user,setUser] = useState(getUserFromCookie)
    const [role,setRole] = useState(getRoleFromCookie)


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, role, setRole}}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node,
};
