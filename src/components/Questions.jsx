import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react';


export default function AcTable({ fetchQuestions, questions, authenticated }) {
    const [active, setActive] = useState(-1);
    const [order, setOrder] = useState(false);
    const [loading, setloading] = useState(false);
    const [problems, setProblems] = useState({ questions: [] });
    const [sortById, setSortById] = useState([]);
    const [sortByName, setSortByName] = useState([]);
    const [sortByDifficulty, setSortByDifficulty] = useState([]);
    const [sortByAcceptance, setSortByAcceptance] = useState([]);

    useEffect(() => {
        if (authenticated && !questions.err && !questions.total && !questions.loading) {
            fetchQuestions();
        }
        else {
            setProblems(questions);
        }
    }, [authenticated, fetchQuestions, questions]);

    const Data = problems.questions.map(q =>
        <tr key={q.stat.question_id}>
            <td>{q.stat.question_id}</td>
            <td><Link to={`/questions/${q.stat.question__title_slug}`}>{q.stat.question__title}</Link></td>
            <td>{q.difficulty.level}</td>
            <td>{(q.stat.total_acs / q.stat.total_submitted * 100).toFixed(2)}%</td>
        </tr>
    )
    var sortFields = (e, { field }) => {
        if (field === active) {
            setOrder(!order);
        }
        else {
            setOrder(false);
        }
        setActive(field);
    }

    function SortIcon({ field }) {
        const icons = ['sort down', 'sort up', 'sort'];
        var icon = '';
        if (field === active) {
            icon = (order) ? icons[1] : icons[0];
        }
        else {
            icon = icons[2];
        }
        return (
            <Icon name={icon} field={field} link onClick={sortFields}></Icon>
        )
    }
    return (
        <div className="container page-content">
            <Table striped bordered hover variant="grey" size="sm" >
                <thead>
                    <tr>
                        <th>ID<SortIcon field='question_id'></SortIcon> </th>
                        <th>Problem name<SortIcon field='question__title'></SortIcon></th>
                        <th>Difficulty<SortIcon field='difficulty'></SortIcon></th>
                        <th>Acceptance<SortIcon field='acceptance'></SortIcon></th>
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