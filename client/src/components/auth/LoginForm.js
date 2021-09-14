import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import AlertMessage from '../layout/AlertMessage';

const LoginForm = () => {
    const { loginUser } = useContext(AuthContext);

    // Local state
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: '',
    });

    const [alert, setAlert] = useState(null);

    const { username, password } = loginForm;

    const onChangeLoginForm = (e) =>
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

    const userLoginFromClient = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(loginForm);

            if (!response.success) {
                setAlert({ type: 'danger', message: response.message });
                setTimeout(() => setAlert(null), 5000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Form className='my-3' onSubmit={userLoginFromClient}>
                <AlertMessage info={alert} />
                <Form.Group className='my-3'>
                    <Form.Control
                        type='text'
                        placeholder='Username'
                        name='username'
                        required
                        value={username}
                        onChange={onChangeLoginForm}
                    />
                </Form.Group>
                <Form.Group className='my-3'>
                    <Form.Control
                        type='password'
                        placeholder='Password'
                        name='password'
                        required
                        value={password}
                        onChange={onChangeLoginForm}
                    />
                </Form.Group>
                <Button variant='success' type='submit'>
                    Login
                </Button>
            </Form>
            <p>
                Don't have an account?
                <Link to='/register'>
                    <Button variant='info' size='sm' className='mx-2'>
                        Register
                    </Button>
                </Link>
            </p>
        </>
    );
};

export default LoginForm;
