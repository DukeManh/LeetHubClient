import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../redux/config';
import { useParams } from 'react-router-dom'
import Submissions from './Submissions';


export default function QuestionDetail() {
    const { title_slug } = useParams();
    const [err, setErr] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [problem, setProb] = useState({});
    useEffect(() => {
        axios.get(API_URL + 'questions/' + title_slug, { withCredentials: true })
            .then((prob) => {
                setProb(prob.data);
                setLoaded(true);
            })
            .catch((error) => {
                setErr(error);
                setLoaded(false);
            });
    }, [title_slug]);

    if (err) {
        return (
            <div className="container">{err.message}</div>
        )
    }
    else if (!loaded) {
        return (
            <div className="container">Loading..</div>
        )
    }
    else {
        return (
            <React.Fragment>
                <div className="container page-content">
                    <div style={{ 'backgroundColor': 'rgba(0, 0, 0, 0.075' }}>
                        <div dangerouslySetInnerHTML={{ __html: `${unescape(problem.content)}` }}></div>
                    </div>
                    <Submissions title_slug={title_slug}></Submissions>
                </div>
            </React.Fragment>
        )
    }
}
