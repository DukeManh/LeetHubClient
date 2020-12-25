import React from 'react';
import { Grommet } from '@bit/grommet.grommet.grommet';
import { grommet } from '@bit/grommet.grommet.themes';
import { Box } from '@bit/grommet.grommet.box';
import { DataTable } from '@bit/grommet.grommet.data-table';
import { Meter } from '@bit/grommet.grommet.meter';
import { Text } from '@bit/grommet.grommet.text';

const amountFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

const columns = [
    {
        property: 'name',
        header: <Text>Name with extra</Text>,
        primary: true,
        footer: 'Total'
    },
    {
        property: 'location',
        header: 'Location'
    },
    {
        property: 'date',
        header: 'Date',
        render: datum =>
            datum.date && new Date(datum.date).toLocaleDateString('en-US'),
        align: 'end'
    },
    {
        property: 'percent',
        header: 'Percent Complete',
        render: function render(datum) {
            return (
                <Box pad={{ vertical: 'xsmall' }}>
                    <Meter
                        values={[{ value: datum.percent }]}
                        thickness='small'
                        size='small'
                    />
                </Box>
            )
        }
    },
    {
        property: 'paid',
        header: 'Paid',
        render: datum => amountFormatter.format(datum.paid / 100),
        align: 'end',
        aggregate: 'sum',
        footer: { aggregate: true }
    }
];

const DATA = [
    {
        name: 'Alan',
        location: '',
        date: '',
        percent: 0,
        paid: 0
    },
    {
        name: 'Bryan',
        location: 'Fort Collins',
        date: '2018-06-10',
        percent: 30,
        paid: 1234
    },
    {
        name: 'Chris',
        location: 'Palo Alto',
        date: '2018-06-09',
        percent: 40,
        paid: 2345
    },
    {
        name: 'Eric',
        location: 'Palo Alto',
        date: '2018-06-11',
        percent: 80,
        paid: 3456
    },
    {
        name: 'Doug',
        location: 'Fort Collins',
        date: '2018-06-10',
        percent: 60,
        paid: 1234
    },
    {
        name: 'Jet',
        location: 'Palo Alto',
        date: '2018-06-09',
        percent: 40,
        paid: 3456
    },
    {
        name: 'Michael',
        location: 'Boise',
        date: '2018-06-11',
        percent: 50,
        paid: 1234
    },
    {
        name: 'Tracy',
        location: 'San Francisco',
        date: '2018-06-10',
        percent: 10,
        paid: 2345
    }
];
export default function Test() {
    return (
        <Grommet theme={grommet}>
            <Box align='center' pad='large'>
                <DataTable columns={columns} data={DATA} />
            </Box>
        </Grommet>
    )
}

