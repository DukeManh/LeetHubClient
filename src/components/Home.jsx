import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';


function Intro({ ac }) {
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
            <h1 className='display-3'>Hello, world!</h1>
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
    console.log('rendered');
    if (auth.authenticated && !auth.loading) {
        return (
            <div className='container my-4 page-content'>
                <Intro ac={auth.acSubmissionNum} />
            </div>
        )
    }
    else {
        return (
            <div className='container my-4 page-content'>
                <Intro ac={[
                    { difficulty: "All", count: 1, submissions: 100 },
                    { difficulty: "All", count: 1, submissions: 1 },
                    { difficulty: "All", count: 1, submissions: 1 },
                    { difficulty: "All", count: 1, submissions: 1 },
                ]}></Intro>
            </div>
        )
    }

}

Home.propTypes = {
    auth: PropTypes.object,
}