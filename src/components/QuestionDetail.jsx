import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../redux/config';
import { useParams } from 'react-router-dom'
import Submissions from './Submissions';
import { Segment, Loader, Dimmer, Image } from 'semantic-ui-react';


export default function QuestionDetail() {
    const { title_slug } = useParams();
    const [err, setErr] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [problem, setProb] = useState({});
    useEffect(() => {
        const source = axios.CancelToken.source();
        const fetchDetail = async () => {
            try {
                const res = (await axios.get(API_URL + 'questions/' + title_slug, { withCredentials: true, cancelToken: source.token }));
                return res.data;
            }
            catch (err) {
                if (axios.isCancel(err)) {
                    console.log(err);
                }
                else {
                    throw err;
                }
            }
        }
        fetchDetail()
            .then((data) => {
                setProb(data);
                setLoaded(true);
            })
            .catch((error) => {
                setErr(error);
                setLoaded(false);
            });
        return () => {
            source.cancel('Component unmounted');
        }
    }, [title_slug]);

    if (err) {
        return (
            <div className='container'>{err.message}</div>
        )
    }
    else if (!loaded) {
        return (
            <div className='container page-content'>
                <Segment style={{ 'margin': 0 }}>
                    <Dimmer active inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>

                    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                </Segment></div>
        )
    }
    else {
        return (
            <React.Fragment>
                <div className='container page-content'>
                    <div style={{}} className="content">
                        <div dangerouslySetInnerHTML={{ __html: `${unescape(problem.content)}` }}></div>
                    </div>
                    <Submissions title_slug={title_slug}></Submissions>
                </div>
            </React.Fragment>
        )
    }
}
