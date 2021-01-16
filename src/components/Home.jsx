import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Icon } from 'semantic-ui-react';
import { useFormik } from 'formik';
import axios from 'axios';
import { API_URL } from '../redux/config';

function Intro({ ac, user }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [target, setTarget] = useState(null);
    const [active, setActive] = useState(0);

    const percentage = useCallback(
        (idx) => {
            return (ac[idx].count / ac[0].submissions * 100).toFixed();
        },
        [ac],
    )

    const showHide = (e, idx) => {
        setActive(idx);
        setShowTooltip(!showTooltip);
        setTarget(e.target);
    }

    return (
        <Jumbotron className="bg-light">
            <h1 className='display-3'>Hello, {user ? user : 'please log in'}</h1>
            <p className='lead'>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
            <hr className='my-4' />
            <h3>Your Progress</h3>
            <ProgressBar variant='info' className='bg-dark h-3 progressDiv'>
                <Overlay target={target} show={showTooltip} placement="top-end">
                    {(props) => (
                        <Tooltip {...props} >
                            {ac[active].count + ' accepted ' + ac[active].difficulty} sumbissions
                        </Tooltip>
                    )}
                </Overlay>
                {ac.slice(1).map((val, idx) => {
                    const color = idx === 0 ? 'success' : ((idx === 1) ? 'warning' : 'danger');
                    return (
                        <ProgressBar animated onMouseOver={e => showHide(e, idx + 1)} onMouseOut={e => showHide(e, idx + 1)} variant={color} now={percentage(idx + 1)} key={idx} />
                    )
                })}
            </ProgressBar>
        </Jumbotron >
    );
}
export default function Home({ auth }) {
    const [disable, setDisable] = useState('');
    const [err, setErr] = useState('');

    const [repo, setRepo] = useState(localStorage.getItem('repo'));
    const source = axios.CancelToken.source();

    useEffect(() => {
        return () => {
            source.cancel('');
        }
    }, [err, repo])

    const handleChange = (e) => {
        formik.handleChange(e);
        if (e.target.value) {
            setDisable(e.target.name === 'repoUrl' ? 'name' : 'url');
        }
        else {
            setDisable('');
        }
    }
    const formik = useFormik({
        initialValues: {
            repoUrl: '',
            repoName: ''
        },
        onSubmit: values => {
            if (values.repoName) {
                axios.post(API_URL + 'github/newrepo', { values }, { withCredentials: true, cancelToken: source.token })
                    .then((response) => {
                        localStorage.setItem('repo', response.data.url);
                        setRepo(localStorage.getItem('repo'));
                        setErr('');
                    })
                    .catch(error => {
                        setErr(error.response.data);
                    })
            }
            else if (values.repoUrl) {
                if (values.repoUrl.match(/^https:\/\/github.com\/.*\/.*/g) !== null) {
                    localStorage.setItem('repo', values.repoUrl);
                    setRepo(localStorage.getItem('repo'));
                    setErr('');
                }
                else {
                    setErr('Invalid Github repository url');
                }
            }
            else {
                setErr('You must either link a github repository or create a new one')
            }
        },
    });
    return (
        <div className='container my-4 page-content'>
            {auth.authenticated && !auth.loading ?
                <React.Fragment>
                    <Intro ac={auth.acSubmissionNum} user={auth.userStatus.username} />
                    <div className="container mb">
                        <div className="mb-2">
                            {localStorage.getItem('repo') !== null ?
                                <span><Icon name="check" color="green"></Icon>Your Leetcode submissions will be commited to   <a href={repo}>{repo}</a></span>
                                :
                                'You have not linked your github repository, create one or specify repo url below'
                            }</div>
                        <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                            <Form.Row className="justify-content-center">
                                <Col md={5}>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>
                                                <Icon name='linkify' />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control placeholder="Repo link..."
                                            disabled={disable === 'url'}
                                            onChange={handleChange}
                                            value={formik.values.repoUrl}
                                            name='repoUrl' />
                                        <InputGroup.Append>
                                            <Button type='submit' variant="success" disabled={disable === 'url'} >Link repo</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                                <Col md={1} className="text-center">Or</Col>
                                <Col md={5}>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>
                                                <Icon name='bolt' />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control placeholder="Repo Name"
                                            value={formik.values.repoName}
                                            onChange={handleChange}
                                            name='repoName'
                                            disabled={disable === 'name'}
                                        />
                                        <InputGroup.Append>
                                            <Button type='submit' variant="primary" disabled={disable === 'name'}
                                            >Create repo</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                                <Col xs={11}>
                                    <small className="text-danger">{err}</small>
                                </Col>
                            </Form.Row>
                        </Form>
                    </div>
                </React.Fragment>
                :
                <Intro ac={[
                    { difficulty: "All", count: 1, submissions: 100 },
                    { difficulty: "All", count: 0, submissions: 0 },
                    { difficulty: "All", count: 0, submissions: 0 },
                    { difficulty: "All", count: 0, submissions: 0 },
                ]}></Intro>
            }
        </div >
    )

}

Home.propTypes = {
    auth: PropTypes.object,
}