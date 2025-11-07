import { useState } from 'react';
import
{
    Card,
    Title,
    Group,
    Button,
    Box,
    Text,
    FileButton,
    Table,
    Select,
    Divider,
} from '@mantine/core';
import { IconUpload, IconRefresh, IconUserCheck } from '@tabler/icons-react';

const MapEvalutor = () =>
{
    const [ evaluatorFile, setEvaluatorFile ] = useState( null );
    const [ studentFile, setStudentFile ] = useState( null );
    const [ manualMappings, setManualMappings ] = useState( [] );
    const [ selectedEvaluator, setSelectedEvaluator ] = useState( '' );
    const [ selectedStudent, setSelectedStudent ] = useState( '' );

    // Dummy data — replace with actual data after upload or API
    const evaluatorOptions = [
        { value: 'eval1', label: 'Evaluator 1' },
        { value: 'eval2', label: 'Evaluator 2' },
        { value: 'eval3', label: 'Evaluator 3' },
    ];

    const studentOptions = [
        { value: 'stu1', label: 'Student 1' },
        { value: 'stu2', label: 'Student 2' },
        { value: 'stu3', label: 'Student 3' },
    ];

    const handleRandomAssign = () =>
    {
        alert( '✅ Random assignment completed!' );
    };

    const handleManualAssign = () =>
    {
        if ( !selectedEvaluator || !selectedStudent )
        {
            alert( 'Please select both evaluator and student!' );
            return;
        }

        const newMapping = {
            evaluator: evaluatorOptions.find( ( e ) => e.value === selectedEvaluator )?.label,
            student: studentOptions.find( ( s ) => s.value === selectedStudent )?.label,
        };

        setManualMappings( [ ...manualMappings, newMapping ] );
        setSelectedEvaluator( '' );
        setSelectedStudent( '' );
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Map Evaluator to Student
            </Title>

            {/* Upload Section */ }
            <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg" maw={ 800 }>
                <Title order={ 4 } mb="md">
                    Upload Excel Files
                </Title>

                <Group mb="md">
                    <FileButton onChange={ setEvaluatorFile } accept=".xlsx,.csv">
                        { ( props ) => (
                            <Button variant="light" leftSection={ <IconUpload size={ 18 } /> } { ...props }>
                                Upload Evaluator File
                            </Button>
                        ) }
                    </FileButton>
                    { evaluatorFile && <Text size="sm">{ evaluatorFile.name }</Text> }
                </Group>

                <Group>
                    <FileButton onChange={ setStudentFile } accept=".xlsx,.csv">
                        { ( props ) => (
                            <Button variant="light" leftSection={ <IconUpload size={ 18 } /> } { ...props }>
                                Upload Student File
                            </Button>
                        ) }
                    </FileButton>
                    { studentFile && <Text size="sm">{ studentFile.name }</Text> }
                </Group>

                <Divider my="lg" />

                <Group justify="flex-end">
                    <Button color="blue" leftSection={ <IconRefresh size={ 18 } /> } onClick={ handleRandomAssign }>
                        Random Assign
                    </Button>
                </Group>
            </Card>

            {/* Manual Assignment Section */ }
            <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg" maw={ 800 }>
                <Title order={ 4 } mb="md">
                    Manual Assignment
                </Title>

                <Group grow mb="md">
                    <Select
                        label="Select Evaluator"
                        placeholder="Choose evaluator"
                        data={ evaluatorOptions }
                        value={ selectedEvaluator }
                        onChange={ setSelectedEvaluator }
                    />
                    <Select
                        label="Select Student"
                        placeholder="Choose student"
                        data={ studentOptions }
                        value={ selectedStudent }
                        onChange={ setSelectedStudent }
                    />
                </Group>

                <Group justify="flex-end">
                    <Button
                        color="green"
                        leftSection={ <IconUserCheck size={ 18 } /> }
                        onClick={ handleManualAssign }
                    >
                        Assign
                    </Button>
                </Group>
            </Card>

            {/* Mapping Table */ }
            { manualMappings.length > 0 && (
                <Card shadow="sm" padding="xl" radius="md" withBorder maw={ 800 }>
                    <Title order={ 4 } mb="md">
                        Manual Assignments
                    </Title>

                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Evaluator</Table.Th>
                                <Table.Th>Student</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            { manualMappings.map( ( map, index ) => (
                                <Table.Tr key={ index }>
                                    <Table.Td>{ map.evaluator }</Table.Td>
                                    <Table.Td>{ map.student }</Table.Td>
                                </Table.Tr>
                            ) ) }
                        </Table.Tbody>
                    </Table>
                </Card>
            ) }
        </Box>
    );
};

export default MapEvalutor;
