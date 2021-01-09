import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Icon } from 'semantic-ui-react';

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
                {ac.map((val, idx) => {
                    const color = idx === 1 ? 'success' : ((idx === 2) ? 'warning' : 'danger');
                    if (idx !== 0)
                        return (
                            <ProgressBar animated onMouseOver={e => showHide(e, idx)} onMouseOut={e => showHide(e, idx)} variant={color} now={percentage(idx)} key={idx} />
                        )
                    else
                        return <div />
                })}
            </ProgressBar>
        </Jumbotron >
    );
}
export default function Home({ auth }) {
    const repo = localStorage.getItem('repo');
    return (
        <div className='container my-4 page-content'>
            {auth.authenticated && !auth.loading ?
                <React.Fragment>
                    <Intro ac={auth.acSubmissionNum} user={auth.userStatus.username} />
                    <div className="container">
                        <p>
                            {localStorage.getItem('repo') !== null ?
                                'Your Leetcode submissions will be commited to ' + repo
                                :
                                'You have not linked your github repository, create one or specify repo url below'
                            }
                        </p>
                        <Form>
                            <Form.Row className="justify-content-center">
                                <Col xs={5}>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>
                                                <Icon name='linkify' />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl id="inlineFormInputGroup" placeholder="Repo link..." />
                                        <InputGroup.Append>
                                            <Button variant="success">Link repo</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                                <Col xs={1} className="text-center">Or</Col>
                                <Col xs={5}>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>
                                                <Icon name='bolt' />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl id="inlineFormInputGroup" placeholder="Repo Name" />
                                        <InputGroup.Append>
                                            <Button variant="primary">Create repo</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                            </Form.Row>
                            <Form.Row >
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