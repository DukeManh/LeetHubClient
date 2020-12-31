import React, { useEffect, useState, useRef } from 'react';
import Table from 'react-bootstrap/Table';
import { Icon, Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import AcTable from './AcTable';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';



export default function Questions({ fetchQuestions, questions, authenticated }) {
    const [active, setActive] = useState('');
    const [order, setOrder] = useState(true);

    const [problems, setProblems] = useState({ questions: [] });

    const [sortById, setSortById] = useState([]);
    const [sortByName, setSortByName] = useState([]);
    const [sortByDifficulty, setSortByDifficulty] = useState([]);
    const [sortByAcceptance, setSortByAcceptance] = useState([]);

    const searchText = useRef(null);

    const onChange = (e) => {
        const val = searchText.current.value;
        if (val.length)
            console.log(val);
    }

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

        switch (field) {
            case 'question_id':
                if (!sortById.length) {
                    compare = (val1, val2) => {
                        return (val1.stat[field] < val2.stat[field]) ? -1 : (val1.stat[field] === val2.stat[field]) ? 0 : 1;
                    }

                    const asc = sortById.concat({ ...problems, questions: problems.questions.slice(0).reverse() });
                    const des = asc.concat({ ...problems });
                    setSortById(des);
                }
                break;
            case 'acceptance':
                if (!sortByAcceptance.length) {
                    compare = (val1, val2) => {
                        return (val1.stat.total_acs / val1.stat.total_submitted) - (val2.stat.total_acs / val2.stat.total_submitted);
                    }

                    const asc = sortByAcceptance.concat({ ...problems, questions: problems.questions.slice(0).sort(compare) });
                    const des = asc.concat({ ...asc[0], questions: asc[0].questions.slice(0).reverse() })
                    setSortByAcceptance(des);
                }
                break;
            case 'difficulty':
                if (!sortByDifficulty.length) {
                    compare = (val1, val2) => {
                        return val1.difficulty.level - val2.difficulty.level;
                    }

                    const asc = sortByDifficulty.concat({ ...problems, questions: problems.questions.slice(0).sort(compare) });
                    const des = asc.concat({ ...asc[0], questions: asc[0].questions.slice(0).reverse() })
                    setSortByDifficulty(des);
                }
                break;
            case 'question__title':
                if (!sortByName.length) {
                    compare = (val1, val2) => {
                        return (val1.stat[field] < val2.stat[field]) ? -1 : (val1.stat[field] === val2.stat[field]) ? 0 : 1;
                    }

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
            <div className='my-2'>
                <Form>
                    <Form.Row className="justify-content-md-center">
                        <Col xs={4}>
                            <Form.Control placeholder="Type here..." ref={searchText} onChange={onChange} />
                        </Col>
                    </Form.Row>
                </Form>
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

function preProcess(input) {
    let M = input.length;
    let lps = Array(M).fill(0);

    let len = 0
    let i = 1;
    while (i < M) {
        if (input[i] === input[len]) {
            len += 1;
            lps[len] = len;
            i++;
        }
        else if (len !== 0) {
            len = lps[len - 1];
        }
        else {
            lps[i] = 0;
            i++;
        }
    }
    return lps;
}


function kmp(input, title) {
    let lps = preProcess(input);

    let M = input.length;
    let N = title.length;

    let j = 0;
    let i = 0;
    while (i < N) {
        if (input[j] === title[i]) {
            i += 1;
            j += 1;
        }

        if (j === M) {
            return true;
        }

        else if (i < N && input[j] !== title[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            }
            else {
                i += 1;
            }
        }
    }
}

