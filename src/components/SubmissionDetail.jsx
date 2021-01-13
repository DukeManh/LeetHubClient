import React, { useState } from 'react';
import axios from 'axios';
import { Accordion, Icon } from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import solarizedlight from 'react-syntax-highlighter/dist/esm/styles/prism/solarizedlight';
import { API_URL } from '../redux/config';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function SubmissionDetail({ activeIndex, handleClick, sub }) {
    const [submission, setSubmission] = useState({ code: `Loading code` });
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    const fetchDetail = (e, props) => {
        if (!loaded) {
            axios.get(API_URL + 'submissions/detail/' + sub.id, { withCredentials: true })
                .then(async (res) => {
                    setSubmission(res.data);
                    setLoaded(true);
                    setError('');
                }).catch((err) => {
                    setError(err.message);
                    setLoaded(false);
                });
        }
        handleClick(e, props);
    }
    return (
        <React.Fragment>
            <Accordion.Title
                active={activeIndex === sub.id}
                index={sub.id}
                onClick={fetchDetail} >
                <Icon name='dropdown' />
                {new Date(sub.timestamps * 1000).toLocaleString(undefined, {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === sub.id} className="code_content">
                <Row className="submission_info">
                    <Col md={7} className="question_id">
                        Submission ID: {sub.id}
                    </Col>
                    <Col md={5} className="d-flex justify-content-around">
                        <div className="d-flex flex-column align-items-center">
                            <Icon name="info" size="large" ></Icon>
                            <span>{sub.status}</span>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <Icon name="language" size="large" ></Icon>
                            <span>{sub.lang.toUpperCase()}</span>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <Icon name="bolt" size="large" ></Icon>
                            <span>{sub.runtime}</span>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <Icon name="disk" size="large"></Icon>
                            <span>{sub.memory}</span>
                        </div>
                    </Col>
                </Row>
                <SyntaxHighlighter className="syntax_highlighter" style={solarizedlight} language={submission.lang === 'python3' ? 'python' : submission.lang}>
                    {(error ? error : submission.code)}
                </SyntaxHighlighter>
            </Accordion.Content>
        </React.Fragment>
    )
}