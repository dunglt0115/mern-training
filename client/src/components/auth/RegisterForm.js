import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import AlertMessage from '../layout/AlertMessage';

const RegisterForm = () => {
    const { registerUser } = useContext(AuthContext);

    // Local state
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [alert, setAlert] = useState(null);

    const { username, password, confirmPassword } = registerForm;

    const onChangeRegisterForm = (e) =>
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

    const userRegisterFromClient = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setAlert({ type: 'danger', message: 'Password do not match!' });
            setTimeout(() => setAlert(null), 5000);
            return;
        }

        try {
            const response = await registerUser(registerForm);

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
            <Form className='my-3' onSubmit={userRegisterFromClient}>
                <AlertMessage info={alert} />
                <Form.Group className='my-3'>
                    <Form.Control
                        type='text'
                        placeholder='Username'
                        name='username'
                        required
                        value={username}
                        onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <Form.Group className='my-3'>
                    <Form.Control
                        type='password'
                        placeholder='Password'
                        name='password'
                        required
                        value={password}
                        onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <Form.Group className='my-3'>
                    <Form.Control
                        type='password'
                        placeholder='Confirm Password'
                        name='confirmPassword'
                        required
                        value={confirmPassword}
                        onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <Button variant='success' type='submit'>
                    Register
                </Button>
            </Form>
            <p>
                Already have an account?
                <Link to='/login'>
                    <Button variant='info' size='sm' className='mx-2'>
                        Login
                    </Button>
                </Link>
            </p>
        </>
    );
};

export default RegisterForm;
