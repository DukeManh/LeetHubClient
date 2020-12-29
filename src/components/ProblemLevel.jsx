import React, { useEffect, useState } from 'react'
import { Label } from 'semantic-ui-react';

export default function ProblemLevel({ level }) {
    const [labelColor, setColor] = useState('');
    const [labelLevel, setLevel] = useState('');
    useEffect(() => {
        let color, difficulty;
        switch (level) {
            case 1:
                color = 'green';
                difficulty = 'easy';
                break;
            case 2:
                color = 'orange';
                difficulty = 'medium';
                break;
            default:
                color = 'red';
                difficulty = 'hard';
                break;
        }
        setColor(color);
        setLevel(difficulty);
    }, [level]);
    return (
        <Label color={labelColor || 'grey'} >
            {labelLevel.toUpperCase()}
        </Label>
    )
}
