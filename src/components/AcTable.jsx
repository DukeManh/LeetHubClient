import React from 'react';
import { Link } from 'react-router-dom';
import ProblemLevel from './ProblemLevel';

export default function AcTable({ problems }) {
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