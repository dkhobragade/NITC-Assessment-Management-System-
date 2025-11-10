import { useState } from 'react';
import
{
    Card,
    Title,
    Select,
    Button,
    Group,
    Box,
    Text,
} from '@mantine/core';
import { IconFileAnalytics } from '@tabler/icons-react';

const GenerateReport = () =>
{
    const [ faculty, setFaculty ] = useState( '' );
    const [ course, setCourse ] = useState( '' );
    const [ success, setSuccess ] = useState( false );

    const facultyOptions = [
        { value: 'john_doe', label: 'John Doe' },
        { value: 'jane_smith', label: 'Jane Smith' },
        { value: 'michael_brown', label: 'Michael Brown' },
    ];

    const courseOptions = [
        { value: 'cs101', label: 'CS101 - Data Structures' },
        { value: 'cs102', label: 'CS102 - Operating Systems' },
        { value: 'cs103', label: 'CS103 - Database Systems' },
    ];

    const handleGenerate = ( e ) =>
    {
        e.preventDefault();

        if ( !faculty || !course ) return alert( 'Please select both faculty and course.' );

        console.log( 'Generating report for:', { faculty, course } );
        setSuccess( true );
        setTimeout( () => setSuccess( false ), 3000 );
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Generate Report
            </Title>

            <Card shadow="sm" padding="xl" radius="md" withBorder maw={ 700 }>
                <form onSubmit={ handleGenerate }>
                    <Select
                        label="Select Faculty"
                        placeholder="Choose a faculty member"
                        data={ facultyOptions }
                        value={ faculty }
                        onChange={ setFaculty }
                        required
                        mb="md"
                    />

                    <Select
                        label="Select Course"
                        placeholder="Choose a course"
                        data={ courseOptions }
                        value={ course }
                        onChange={ setCourse }
                        required
                        mb="md"
                    />

                    <Group justify="flex-end" mt="lg">
                        <Button
                            type="submit"
                            leftSection={ <IconFileAnalytics size={ 18 } /> }
                        >
                            Generate Report
                        </Button>
                    </Group>

                    { success && (
                        <Text c="green" mt="md" fw={ 500 }>
                            ✅ Report generated successfully! (You can now export or view it)
                        </Text>
                    ) }
                </form>
            </Card>
        </Box>
    );
};

export default GenerateReport;
