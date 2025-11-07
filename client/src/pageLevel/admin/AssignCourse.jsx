import { useState } from 'react';
import { Select, Button, Card, Title, Group, Box, Text } from '@mantine/core';

const AssignCourse = () =>
{
    const [ faculty, setFaculty ] = useState( '' );
    const [ course, setCourse ] = useState( '' );
    const [ success, setSuccess ] = useState( false );

    // Dummy data — later replace with API data
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

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();

        if ( !faculty || !course ) return alert( 'Please select both Faculty and Course.' );

        console.log( 'Assigned:', { faculty, course } );
        setSuccess( true );

        // reset after submission
        setFaculty( '' );
        setCourse( '' );
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Assign Course to Faculty
            </Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder maw={ 600 }>
                <form onSubmit={ handleSubmit }>
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
                        <Button type="submit">Assign Course</Button>
                    </Group>

                    { success && (
                        <Text c="green" mt="md" fw={ 500 }>
                            ✅ Course successfully assigned!
                        </Text>
                    ) }
                </form>
            </Card>
        </Box>
    );
};

export default AssignCourse;
