import NavBar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
import learnItLogo from '../../assets/logo.svg';
import logoutIcon from '../../assets/logout.svg';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
//3:40
const NavBarMenu = () => {
    const {
        authState: {
            user: { username },
        },
        logoutUser,
    } = useContext(AuthContext);

    const logout = () => logoutUser();

    return (
        <NavBar expand='lg' bg='primary' variant='dark' className='shadow'>
            <NavBar.Brand className='font-weight-bolder text-white'>
                <img src={learnItLogo} alt='learnItLogo' width='32' height='32' className='mr-2' />
                Welcome {username}
            </NavBar.Brand>

            <NavBar.Toggle aria-controls='basic-navbar-nav' />

            <NavBar.Collapse id='basic-navbar-nav'>
                <Nav className='mr-auto'>
                    <Nav.Link className='font-weight-bolder text-white' to='/dashboard' as={Link}>
                        Dashboard
                    </Nav.Link>
                    <Nav.Link className='font-weight-bolder text-white' to='/about' as={Link}>
                        About
                    </Nav.Link>
                </Nav>

                <Nav>
                    <Button
                        variant='secondary'
                        className='font-weight-bolder text-white'
                        onClick={logout}
                    >
                        <img
                            src={logoutIcon}
                            alt='logoutIcon'
                            width='32'
                            height='32'
                            className='mr-2'
                        />
                        Logout
                    </Button>
                </Nav>
            </NavBar.Collapse>
        </NavBar>
    );
};

export default NavBarMenu;
