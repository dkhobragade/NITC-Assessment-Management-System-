import { useState } from 'react';
import
{
    Box,
    Title,
    Card,
    Table,
    Button,
    Group,
    Text,
    Divider,
    Badge,
} from '@mantine/core';
import { IconDownload, IconChartBar } from '@tabler/icons-react';

const GenerateReport = () =>
{
    // Dummy data — replace later with API
    const [ reports ] = useState( [
        { id: 1, name: 'Alice Johnson', roll: 'CS21B101', marks: 85 },
        { id: 2, name: 'Bob Williams', roll: 'CS21B102', marks: 73 },
        { id: 3, name: 'Charlie Brown', roll: 'CS21B103', marks: 92 },
        { id: 4, name: 'David Smith', roll: 'CS21B104', marks: 60 },
    ] );

    const total = reports.length;
    const avgMarks = ( reports.reduce( ( a, b ) => a + b.marks, 0 ) / total ).toFixed( 2 );

    const handleDownload = ( type ) =>
    {
        alert( `📄 ${ type.toUpperCase() } report download initiated!` );
        // Replace with actual download API later
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="md">
                Evaluation Report
            </Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
                <Group justify="space-between">
                    <div>
                        <Text fw={ 500 } size="lg">Summary</Text>
                        <Text c="dimmed" size="sm">
                            Overview of all students evaluated by you
                        </Text>
                    </div>
                    <Badge color="blue" variant="filled" size="lg">
                        { total } Students
                    </Badge>
                </Group>

                <Divider my="md" />

                <Group grow>
                    <Card shadow="xs" padding="md" radius="md" withBorder>
                        <Text fw={ 600 } size="lg">Average Marks</Text>
                        <Text size="xl" mt={ 6 }>{ avgMarks }</Text>
                    </Card>

                    <Card shadow="xs" padding="md" radius="md" withBorder>
                        <Text fw={ 600 } size="lg">Highest Marks</Text>
                        <Text size="xl" mt={ 6 }>{ Math.max( ...reports.map( r => r.marks ) ) }</Text>
                    </Card>

                    <Card shadow="xs" padding="md" radius="md" withBorder>
                        <Text fw={ 600 } size="lg">Lowest Marks</Text>
                        <Text size="xl" mt={ 6 }>{ Math.min( ...reports.map( r => r.marks ) ) }</Text>
                    </Card>
                </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Roll No</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Marks</Table.Th>
                            <Table.Th>Performance</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        { reports.map( ( student ) => (
                            <Table.Tr key={ student.id }>
                                <Table.Td>{ student.roll }</Table.Td>
                                <Table.Td>{ student.name }</Table.Td>
                                <Table.Td>{ student.marks }</Table.Td>
                                <Table.Td>
                                    <Badge
                                        color={
                                            student.marks >= 85
                                                ? 'green'
                                                : student.marks >= 70
                                                    ? 'yellow'
                                                    : 'red'
                                        }
                                    >
                                        { student.marks >= 85
                                            ? 'Excellent'
                                            : student.marks >= 70
                                                ? 'Good'
                                                : 'Needs Improvement' }
                                    </Badge>
                                </Table.Td>
                            </Table.Tr>
                        ) ) }
                    </Table.Tbody>
                </Table>
            </Card>

            <Group justify="flex-end" mt="lg">
                <Button
                    leftSection={ <IconDownload size={ 18 } /> }
                    variant="outline"
                    color="blue"
                    onClick={ () => handleDownload( 'csv' ) }
                >
                    Download CSV
                </Button>
                <Button
                    leftSection={ <IconChartBar size={ 18 } /> }
                    color="green"
                    onClick={ () => handleDownload( 'pdf' ) }
                >
                    Generate PDF Report
                </Button>
            </Group>
        </Box>
    );
};

export default GenerateReport;
