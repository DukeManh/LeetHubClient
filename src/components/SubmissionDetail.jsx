import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, Icon, Button } from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import solarizedlight from 'react-syntax-highlighter/dist/esm/styles/prism/solarizedlight';
import { API_URL } from '../redux/config';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useFormik } from 'formik';
import CommitForm from './CommitForm';


export default function SubmissionDetail({ activeIndex, handleClick, sub, problem }) {
    const [submission, setSubmission] = useState({ code: `Loading code` });
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [formActive, setFormActive] = useState(false);
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');


    const formik = useFormik({
        initialValues: {
            message: '',
            description: ''
        },
        onSubmit: values => {
            const repo = localStorage.getItem('repo');
            if (repo !== null) {
                axios.post(API_URL + 'github/commit', {
                    sub: {
                        ...sub,
                        code: submission.code,
                    },
                    url: repo,
                    frontendId: problem.questionFrontendId,
                    title: problem.title,
                    slug: problem.slug,
                    message: values.message,
                    descrition: values.description
                }, { withCredentials: true })
                    .then((response) => {
                        setSuccess('Congrats, your code has been commited to ' + repo);
                        setErr('');
                    })
                    .catch(error => {
                        setSuccess('');
                        setErr(error.response.data);
                    })
            }
            else {
                setSuccess('');
                setErr('You have not specified which repository to commit to, please do so in home page');
            }
        }
    })

    const source = axios.CancelToken.source();
    useEffect(() => {
        return () => {
            source.cancel('');
        }
    }, [])

    const fetchDetail = (e, props) => {
        if (!loaded) {
            axios.get(API_URL + 'submissions/detail/' + sub.id, { withCredentials: true, cancelToken: source.token })
                .then((res) => {
                    setSubmission(res.data);
                    setLoaded(true);
                    setError('');
                }).catch((err) => {
                    setError(err.response.data);
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
            <Accordion.Content active={activeIndex === sub.id} >
                <div className="code_content">
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
                    <div id="commit_btn">
                        <Button icon labelPosition='right' onClick={() => {
                            if (submission.code !== 'Loading code') {
                                setFormActive(!formActive);
                            }
                        }}> Commit/Upload
                        <Icon name='arrow down' />
                        </Button>
                    </div>
                    <SyntaxHighlighter className="syntax_highlighter" style={solarizedlight} language={submission.lang === 'python3' ? 'python' : submission.lang === 'golang' ? 'go' : submission.lang}>
                        {(error ? error : submission.code)}
                    </SyntaxHighlighter>
                </div>
                {formActive ?
                    <CommitForm formik={formik} err={err} success={success} />
                    :
                    <></>
                }
            </Accordion.Content>
        </React.Fragment >
    )
}