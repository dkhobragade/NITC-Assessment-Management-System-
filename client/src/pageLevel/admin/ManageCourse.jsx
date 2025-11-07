import { useState } from 'react';
import { TextInput, Textarea, NumberInput, Button, Card, Title, Group, Box } from '@mantine/core';

const ManageCourse = () =>
{
    const [ courseName, setCourseName ] = useState( '' );
    const [ courseCode, setCourseCode ] = useState( '' );
    const [ description, setDescription ] = useState( '' );
    const [ credits, setCredits ] = useState( '' );
    const [ success, setSuccess ] = useState( false );

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();
        // Later you can integrate this with backend (API call)
        console.log( { courseName, courseCode, description, credits } );
        setSuccess( true );

        // Reset form after submission
        setCourseName( '' );
        setCourseCode( '' );
        setDescription( '' );
        setCredits( '' );
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">Add New Course</Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder maw={ 600 }>
                <form onSubmit={ handleSubmit }>
                    <TextInput
                        label="Course Name"
                        placeholder="Enter course name"
                        required
                        value={ courseName }
                        onChange={ ( e ) => setCourseName( e.target.value ) }
                        mb="md"
                    />

                    <TextInput
                        label="Course Code"
                        placeholder="e.g. CS101"
                        required
                        value={ courseCode }
                        onChange={ ( e ) => setCourseCode( e.target.value ) }
                        mb="md"
                    />

                    <Textarea
                        label="Course Description"
                        placeholder="Briefly describe the course..."
                        autosize
                        minRows={ 3 }
                        value={ description }
                        onChange={ ( e ) => setDescription( e.target.value ) }
                        mb="md"
                    />

                    <NumberInput
                        label="Credits"
                        placeholder="Enter course credits"
                        min={ 1 }
                        max={ 10 }
                        value={ credits }
                        onChange={ setCredits }
                        mb="md"
                    />

                    <Group justify="flex-end" mt="lg">
                        <Button type="submit">Add Course</Button>
                    </Group>

                    { success && (
                        <div style={ { marginTop: '15px', color: 'green', fontWeight: '500' } }>
                            ✅ Course added successfully!
                        </div>
                    ) }
                </form>
            </Card>
        </Box>
    );
};

export default ManageCourse;
