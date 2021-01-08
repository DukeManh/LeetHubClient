import React, { useState, useEffect } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Navbar from 'react-bootstrap/Navbar'
import Modal from 'react-bootstrap/Modal'
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import leetcode from '../leetcode.svg';

function LoginForm({ loginUser, loading, err }) {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: values => {
            loginUser(values);
        },
    });
    return (
        <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId='username'>
                <Form.Label>User name</Form.Label>
                <Form.Control type='text' placeholder='Enter username or email'
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder='Enter password'
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                <Form.Text className='text-muted'  >Your password is only used to login Leetcode.com on your behalf</Form.Text>
            </Form.Group>
            {loading ? <Spinner animation='grow' variant='secondary' /> : <Button variant='primary' type='submit'> Submit </Button>}
            {err ?
                <div className='alert alert-dismissible alert-danger mt-2'>
                    <strong>Oh snap!</strong> {err}
                </div> : <div />
            }
        </Form>
    );
};

function Header({ auth, loginUser, logoutUser }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (auth.authenticated) setShow(false);
    }, [auth.authenticated])
    return (
        <Navbar bg='light' expand='lg' className='mb-4'>
            <div className='container '>
                <Navbar.Brand>
                    <Link className='nav-link' to='/'>
                        <span className="text-warning">Leet</span>
                        <span className="text-dark" >hub</span>
                        <span className="mx-2">
                            <img src={leetcode} alt='leetcode icon' style={{ 'height': 33, 'width': 33 }}></img>
                            <Icon name='plus' size='tiny' color='black' />
                            <Icon name='github' size='large' color='black' />
                        </span>
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='mr-auto' bg='light'>
                        <Link className='nav-link' to='/'>Home</Link>
                        <Link className='nav-link' to='/questions'>My Submissions</Link>
                    </Nav>
                    <Nav className='ml-auto'>
                        <Form inline >
                            <FormControl type='text' placeholder='Search' className='mr-sm-4 rounded-3' />
                        </Form>
                        {auth.authenticated ?
                            <React.Fragment>
                                <img src={auth.userStatus.avatar} alt='' style={{ 'width': '2em' }} />
                                <NavDropdown variant='success' title={auth.userStatus.realName} id='basic-nav-dropdown'>
                                    <NavDropdown.Item onClick={logoutUser}>Logout</NavDropdown.Item>
                                </NavDropdown></React.Fragment>
                            :
                            <Button className='secondary my-2 my-sm-0 ml-2' onClick={() => setShow(!show)}>Login</Button>
                        }
                    </Nav>
                </Navbar.Collapse>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login With Github</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your are about to login to <a href='https:://leetcode.com'>Leetcode</a> (US endpoint)
                    <LoginForm loginUser={loginUser}
                            loading={auth.loading}
                            err={auth.err}
                        ></LoginForm>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => setShow(!show)}> Close </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Navbar>
    )
}

Header.propTypes = {
    auth: PropTypes.object,
    loading: PropTypes.bool,
    loginUser: PropTypes.func,
    logoutUser: PropTypes.func,
}
LoginForm.propTypes = {
    loginUser: PropTypes.func,
    loading: PropTypes.bool,
    err: PropTypes.string,
}

export default Header;