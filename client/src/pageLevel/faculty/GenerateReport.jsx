import { useState } from 'react';
import
{
    Box,
    Card,
    Title,
    Select,
    Button,
    Group,
    Table,
    Text,
} from '@mantine/core';
import { IconFileSpreadsheet, IconFileText } from '@tabler/icons-react';

const GenerateReport = () =>
{
    const [ course, setCourse ] = useState( '' );
    const [ reportType, setReportType ] = useState( '' );
    const [ reportData, setReportData ] = useState( [] );

    // Dummy course list (replace with API call)
    const courseOptions = [
        { value: 'cs101', label: 'CS101 - Data Structures' },
        { value: 'cs102', label: 'CS102 - Operating Systems' },
        { value: 'cs103', label: 'CS103 - Database Systems' },
    ];

    // Dummy data generator (simulate report)
    const generateReportData = () =>
    {
        const data = [
            { id: 1, student: 'Alice', task: 'Project 1', marks: 85 },
            { id: 2, student: 'Bob', task: 'Project 1', marks: 92 },
            { id: 3, student: 'Charlie', task: 'Project 1', marks: 78 },
        ];
        setReportData( data );
    };

    const handleGenerate = () =>
    {
        if ( !course || !reportType )
        {
            alert( 'Please select both course and report type' );
            return;
        }
        generateReportData();
    };

    const handleDownload = ( format ) =>
    {
        if ( reportData.length === 0 )
        {
            alert( 'Please generate the report first' );
            return;
        }

        if ( format === 'csv' )
        {
            const csvRows = [
                [ 'Student Name', 'Task', 'Marks' ],
                ...reportData.map( ( r ) => [ r.student, r.task, r.marks ] ),
            ];
            const csvContent = csvRows.map( ( e ) => e.join( ',' ) ).join( '\n' );
            const blob = new Blob( [ csvContent ], { type: 'text/csv' } );
            const url = window.URL.createObjectURL( blob );
            const a = document.createElement( 'a' );
            a.href = url;
            a.download = 'faculty_report.csv';
            a.click();
        }

        if ( format === 'pdf' )
        {
            alert( '📄 PDF download will be implemented later.' );
        }
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Generate Report
            </Title>

            {/* Report Filters */ }
            <Card shadow="sm" padding="xl" radius="md" withBorder maw={ 700 } mb="lg">
                <Group grow mb="md">
                    <Select
                        label="Select Course"
                        placeholder="Choose a course"
                        data={ courseOptions }
                        value={ course }
                        onChange={ setCourse }
                    />

                    <Select
                        label="Report Type"
                        placeholder="Choose report type"
                        data={ [
                            { value: 'task', label: 'Task Report' },
                            { value: 'evaluation', label: 'Evaluation Report' },
                            { value: 'student', label: 'Student Summary' },
                        ] }
                        value={ reportType }
                        onChange={ setReportType }
                    />
                </Group>

                <Group justify="flex-end">
                    <Button onClick={ handleGenerate }>Generate</Button>
                </Group>
            </Card>

            {/* Report Table */ }
            { reportData.length > 0 && (
                <Card shadow="sm" padding="xl" radius="md" withBorder maw={ 700 }>
                    <Group justify="space-between" mb="md">
                        <Title order={ 4 }>Report Preview</Title>
                        <Group>
                            <Button
                                variant="light"
                                color="green"
                                leftSection={ <IconFileSpreadsheet size={ 18 } /> }
                                onClick={ () => handleDownload( 'csv' ) }
                            >
                                Download CSV
                            </Button>
                            <Button
                                variant="light"
                                color="blue"
                                leftSection={ <IconFileText size={ 18 } /> }
                                onClick={ () => handleDownload( 'pdf' ) }
                            >
                                Download PDF
                            </Button>
                        </Group>
                    </Group>

                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Student Name</Table.Th>
                                <Table.Th>Task</Table.Th>
                                <Table.Th>Marks</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            { reportData.map( ( row ) => (
                                <Table.Tr key={ row.id }>
                                    <Table.Td>{ row.student }</Table.Td>
                                    <Table.Td>{ row.task }</Table.Td>
                                    <Table.Td>{ row.marks }</Table.Td>
                                </Table.Tr>
                            ) ) }
                        </Table.Tbody>
                    </Table>
                </Card>
            ) }

            { reportData.length === 0 && (
                <Text c="dimmed" mt="xl">
                    No report generated yet. Select filters and click “Generate”.
                </Text>
            ) }
        </Box>
    );
};

export default GenerateReport;
