import { createContext, useReducer, useEffect } from 'react';
import { authReducer } from '../reducers/authReducer';
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from './constants';
import axios from 'axios';
import setAuthTokenForEveryRequest from '../utils/setAuthToken';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, {
        /**
         * @desc This is the initial state.
         *
         * @authLoading is true if user has never been authenticated or is being authenticated.
         * @isAuthenticated is false, @user is null jwt token invalid or missing.
         */
        authLoading: true,
        isAuthenticated: false,
        user: null,
    });

    const authenticateUser = async () => {
        if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
            setAuthTokenForEveryRequest(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
        }

        try {
            const response = await axios.get(`${apiUrl}/auth`);

            if (response.data.success) {
                dispatch({
                    type: 'SET_AUTH',
                    payload: {
                        isAuthenticated: true,
                        user: response.data.user,
                    },
                });
            }
        } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
            setAuthTokenForEveryRequest(null);
            dispatch({
                type: 'SET_AUTH',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    };

    /**
     * @desc Run authenticateUser when the app start.
     */
    useEffect(() => authenticateUser(), []);

    /**
     * @desc Connect to backend with user login form data.
     *
     * @param {*} userForm
     * @returns response.data
     */
    const loginUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, userForm);

            if (response.data.success) {
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);
            }

            await authenticateUser();

            return response.data;
        } catch (error) {
            if (error.response.data) {
                return error.response.data;
            } else {
                return { success: false, error: error.message };
            }
        }
    };

    /**
     * @desc Connect to backend with user register form data.
     *
     * @param {*} userForm
     * @returns response.data
     */
    const registerUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/register`, userForm);

            if (response.data.success) {
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);
            }

            await authenticateUser();

            return response.data;
        } catch (error) {
            if (error.response.data) {
                return error.response.data;
            } else {
                return { success: false, error: error.message };
            }
        }
    };

    /**
     * @desc Logout user.
     */
    const logoutUser = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        dispatch({
            type: 'SET_AUTH',
            payload: {
                isAuthenticated: false,
                user: null,
            },
        });
    };

    // Export context data for children
    const authContextData = { loginUser, registerUser, logoutUser, authState };

    return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
