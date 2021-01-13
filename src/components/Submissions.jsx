import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion } from 'semantic-ui-react';
import { API_URL } from '../redux/config';
import SubmissionDetail from './SubmissionDetail';

export default function Submissions({ title_slug }) {
    const [err, setErr] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [submissions, setSubmissions] = useState([]);

    const [activeIndex, setActive] = useState(-1);

    const handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        setActive(newIndex);
    }
    useEffect(() => {
        axios.get(API_URL + 'submissions/' + title_slug, { withCredentials: true })
            .then((res) => {
                setSubmissions(res.data);
                setLoaded(true);
            })
            .catch((error) => {
                setErr(error.message);
                setLoaded(false);
            });
    }, [title_slug]);

    if (err) {
        return (
            <div className='container'>{err}</div>
        )
    }
    else if (!loaded) {
        return (
            <div className='container'>Loading..</div>
        )
    }
    else {
        return (
            <div className='container'>
                <Accordion>
                    {
                        submissions.map(sub =>
                            <SubmissionDetail key={sub.id}
                                handleClick={handleClick}
                                activeIndex={activeIndex}
                                sub={sub}
                            ></SubmissionDetail>
                        )
                    }
                </Accordion>
            </div>
        )
    }
}