import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { API_URL } from '../redux/config';
import axios from 'axios';

export default function SubmissionDetail({ activeIndex, handleClick, submissionId }) {
    const [submission, setSubmission] = useState({ code: `Loading code` });
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    const fetchDetail = (e, props) => {
        if (!loaded) {
            axios.get(API_URL + 'submissions/detail/' + submissionId, { withCredentials: true })
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
                active={activeIndex === submissionId}
                index={submissionId}
                onClick={fetchDetail} >
                <Icon name='dropdown' />
                Submission #{submissionId}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === submissionId}>
                <SyntaxHighlighter style={prism} language={submission.lang === 'python3' ? 'python' : submission.lang} wrapLongLines>
                    {(error ? error : submission.code)}
                </SyntaxHighlighter>
            </Accordion.Content>
        </React.Fragment>
    )
}