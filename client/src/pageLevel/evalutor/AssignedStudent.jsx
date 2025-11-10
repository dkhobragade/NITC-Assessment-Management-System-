import { useState } from 'react';
import
{
    Box,
    Title,
    Card,
    Table,
    Button,
    TextInput,
    Group,
    Text,
} from '@mantine/core';
import { IconFileText, IconCheck } from '@tabler/icons-react';

const AssignedStudent = () =>
{
    // Dummy data — replace with API data later
    const [ students, setStudents ] = useState( [
        {
            id: 1,
            name: 'Alice Johnson',
            roll: 'CS21B101',
            pdfUrl: '/uploads/alice_project.pdf',
            marks: '',
        },
        {
            id: 2,
            name: 'Bob Williams',
            roll: 'CS21B102',
            pdfUrl: '/uploads/bob_project.pdf',
            marks: '',
        },
        {
            id: 3,
            name: 'Charlie Brown',
            roll: 'CS21B103',
            pdfUrl: '/uploads/charlie_project.pdf',
            marks: '',
        },
    ] );

    // Update marks for a specific student
    const handleMarksChange = ( id, value ) =>
    {
        setStudents( ( prev ) =>
            prev.map( ( student ) =>
                student.id === id ? { ...student, marks: value } : student
            )
        );
    };

    // Submit all marks
    const handleSubmitMarks = () =>
    {
        const filled = students.filter( ( s ) => s.marks !== '' );
        if ( filled.length !== students.length )
        {
            alert( 'Please fill marks for all students before submitting.' );
            return;
        }

        console.log( 'Marks submitted:', students );
        alert( '✅ Marks submitted successfully!' );
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Assigned Students
            </Title>

            <Card shadow="sm" padding="xl" radius="md" withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Roll No</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Uploaded PDF</Table.Th>
                            <Table.Th>Marks</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        { students.map( ( student ) => (
                            <Table.Tr key={ student.id }>
                                <Table.Td>{ student.roll }</Table.Td>
                                <Table.Td>{ student.name }</Table.Td>
                                <Table.Td>
                                    <Button
                                        component="a"
                                        href={ student.pdfUrl }
                                        target="_blank"
                                        variant="light"
                                        color="blue"
                                        leftSection={ <IconFileText size={ 16 } /> }
                                    >
                                        View PDF
                                    </Button>
                                </Table.Td>
                                <Table.Td>
                                    <TextInput
                                        placeholder="Enter Marks"
                                        value={ student.marks }
                                        onChange={ ( e ) =>
                                            handleMarksChange( student.id, e.currentTarget.value )
                                        }
                                        w={ 100 }
                                    />
                                </Table.Td>
                            </Table.Tr>
                        ) ) }
                    </Table.Tbody>
                </Table>
            </Card>

            <Group justify="flex-end" mt="lg">
                <Button
                    leftSection={ <IconCheck size={ 18 } /> }
                    color="green"
                    onClick={ handleSubmitMarks }
                >
                    Submit Marks
                </Button>
            </Group>

            { students.length === 0 && (
                <Text c="dimmed" mt="xl">
                    No students assigned yet.
                </Text>
            ) }
        </Box>
    );
};

export default AssignedStudent;
