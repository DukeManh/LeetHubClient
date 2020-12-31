import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom'
import { Icon, Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import ProblemLevel from './ProblemLevel';



export default function Questions({ fetchQuestions, questions, authenticated }) {
    const [active, setActive] = useState('');
    const [order, setOrder] = useState(true);
    const [problems, setProblems] = useState({ questions: [] });
    const [sortById, setSortById] = useState([]);
    const [sortByName, setSortByName] = useState([]);
    const [sortByDifficulty, setSortByDifficulty] = useState([]);
    const [sortByAcceptance, setSortByAcceptance] = useState([]);
    useEffect(() => {
        if (authenticated && !questions.err
            && !questions.total && !questions.loading) {
            fetchQuestions();
        }
        else {
            setProblems(questions);
        }
    }, [authenticated, questions, fetchQuestions]);

    useEffect(() => {
        switch (active) {
            case 'question_id':
                setProblems((!order) ? sortById[0] : sortById[1]);
                break;

            case 'question__title':
                setProblems((!order) ? sortByName[0] : sortByName[1]);
                break;

            case 'difficulty':
                setProblems((!order) ? sortByDifficulty[0] : sortByDifficulty[1]);
                break;
            case 'acceptance':
                setProblems((!order) ? sortByAcceptance[0] : sortByAcceptance[1]);
                break;
            default:
                setProblems(questions);
                break;
        }
    }, [order, active]);
    const sortFields = (e, { field }) => {

        var compare;
        if (field === 'acceptance') {
            compare = (val1, val2) => {
                return (val1.stat.total_acs / val1.stat.total_submitted) - (val2.stat.total_acs / val2.stat.total_submitted);
            }
        }
        else if (field === 'difficulty') {
            compare = (val1, val2) => {
                return val1.difficulty.level - val2.difficulty.level;
            }
        }
        else {
            compare = (val1, val2) => {
                return (val1.stat[field] < val2.stat[field]) ? -1 : (val1.stat[field] === val2.stat[field]) ? 0 : 1;
            }
        }
        switch (field) {
            case 'question_id':
                if (!sortById.length) {
                    console.log('Hi');
                    const asc = sortById.concat({ ...problems, questions: problems.questions.slice(0).reverse() });
                    const des = asc.concat({ ...problems });
                    setSortById(des);
                }
                break;
            case 'acceptance':
                if (!sortByAcceptance.length) {
                    const asc = sortByAcceptance.concat({ ...problems, questions: problems.questions.slice(0).sort(compare) });
                    const des = asc.concat({ ...asc[0], questions: asc[0].questions.slice(0).reverse() })
                    setSortByAcceptance(des);
                }
                break;
            case 'difficulty':
                if (!sortByDifficulty.length) {
                    const asc = sortByDifficulty.concat({ ...problems, questions: problems.questions.slice(0).sort(compare) });
                    const des = asc.concat({ ...asc[0], questions: asc[0].questions.slice(0).reverse() })
                    setSortByDifficulty(des);
                }
                break;
            case 'question__title':
                if (!sortByName.length) {
                    const asc = sortByName.concat({ ...problems, questions: problems.questions.slice(0).sort(compare) });
                    const des = asc.concat({ ...asc[0], questions: asc[0].questions.slice(0).reverse() })
                    setSortByName(des);
                }
                break;
            default:
                break;
        }
        if (active !== field) setActive(field);
        setOrder((active === field) ? !order : false);
    }
    function SortIcon({ field }) {
        const icons = ['sort down', 'sort up', 'sort'];
        var icon = (field === active) ? ((order) ? icons[1] : icons[0]) : icons[2];
        return (
            <Icon name={icon} field={field} link onClick={sortFields} color={'blue'}></Icon>
        )
    }
    return (
        <div className='container page-content'>
            <div className='mb-4'>
                <h3><Icon name={'file code outline'} size='large'></Icon><strong>Your Submissions</strong></h3>
                <p>You have solved {problems.ac_total}/{problems.questions.length} problems attempted</p>
            </div>
            <Table striped bordered hover variant='grey' size='sm' >
                <thead>
                    <tr className='text-success'>
                        <th>ID<SortIcon field='question_id'></SortIcon> </th>
                        <th>Problem name<SortIcon field='question__title'></SortIcon></th>
                        <th>Difficulty<SortIcon field='difficulty'></SortIcon></th>
                        <th>Acceptance<SortIcon field='acceptance'></SortIcon></th>
                    </tr>
                </thead>
                <AcTable problems={problems.questions}></AcTable>
            </Table>
            {questions.loading &&
                <Segment style={{ 'margin': 0 }}>
                    <Dimmer active inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>

                    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                </Segment>
            }
            {questions.err &&
                <h5 className='text-danger'>{questions.err}</h5>}
        </div>
    )
}


function AcTable({ problems }) {
    return (
        <tbody>
            {problems.map(q => {
                var stat = q.stat;
                return (
                    <tr key={stat.question_id}>
                        <td>{stat.question_id}</td>
                        <td><Link to={`/questions/${stat.question__title_slug}`}>{stat.question__title}</Link></td>
                        <td><ProblemLevel level={q.difficulty.level} /></td>
                        <td>{(stat.total_acs / stat.total_submitted * 100).toFixed(2)}%</td>
                    </tr>
                )
            })}
        </tbody>
    )
}

AcTable.propTypes = {
    questions: PropTypes.object,
    fetchQuestions: PropTypes.func,
    val: PropTypes.number
}