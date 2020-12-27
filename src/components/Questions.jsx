import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom'


export default function AcTable({ fetchQuestions, questions, authenticated }) {
    useEffect(() => {
        if (authenticated && !questions.err &&
            !questions.total && !questions.loading) {
            console.log('Hello');
            fetchQuestions();
        }
    });

    const Data = questions.questions.map(q =>
        <tr key={q.stat.question_id}>
            <td>{q.stat.question_id}</td>
            <td><Link to={`/questions/${q.stat.question__title_slug}`}>{q.stat.question__title}</Link></td>
            <td>{q.difficulty.level}</td>
            <td>{(q.stat.total_acs / q.stat.total_submitted * 100).toFixed(2)}%</td>
        </tr>
    )
    return (
        <div className="container page-content">
            <Table striped bordered hover variant="grey" size="sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Problem name</th>
                        <th>Difficulty</th>
                        <th>Accepted Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {Data}
                </tbody>
            </Table>
        </div>
    )
}

AcTable.propTypes = {
    questions: PropTypes.object,
    fetchQuestions: PropTypes.func,
    val: PropTypes.number
}