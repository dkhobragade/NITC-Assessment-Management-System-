import { useState } from 'react';
import
{
    Card,
    Title,
    TextInput,
    Textarea,
    Select,
    Button,
    Group,
    Box,
    Text,
    // DatePickerInput,
} from '@mantine/core';
import { IconClipboardPlus } from '@tabler/icons-react';

const CreateTask = () =>
{
    const [ course, setCourse ] = useState( '' );
    const [ title, setTitle ] = useState( '' );
    const [ description, setDescription ] = useState( '' );
    const [ dueDate, setDueDate ] = useState( null );
    const [ success, setSuccess ] = useState( false );

    // Dummy data for courses (replace with API call)
    const courseOptions = [
        { value: 'cs101', label: 'CS101 - Data Structures' },
        { value: 'cs102', label: 'CS102 - Operating Systems' },
        { value: 'cs103', label: 'CS103 - Database Systems' },
    ];

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();

        if ( !course || !title || !description || !dueDate )
        {
            alert( 'Please fill in all fields' );
            return;
        }

        console.log( 'Task Created:', { course, title, description, dueDate } );
        setSuccess( true );

        // Reset fields
        setCourse( '' );
        setTitle( '' );
        setDescription( '' );
        setDueDate( null );

        // Hide success message after 3s
        setTimeout( () => setSuccess( false ), 3000 );
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Create New Task
            </Title>

            <Card shadow="sm" padding="xl" radius="md" withBorder maw={ 700 }>
                <form onSubmit={ handleSubmit }>
                    <Select
                        label="Select Course"
                        placeholder="Choose a course"
                        data={ courseOptions }
                        value={ course }
                        onChange={ setCourse }
                        required
                        mb="md"
                    />

                    <TextInput
                        label="Task Title"
                        placeholder="Enter task title"
                        value={ title }
                        onChange={ ( e ) => setTitle( e.target.value ) }
                        required
                        mb="md"
                    />

                    <Textarea
                        label="Task Description"
                        placeholder="Enter detailed task description"
                        minRows={ 4 }
                        value={ description }
                        onChange={ ( e ) => setDescription( e.target.value ) }
                        required
                        mb="md"
                    />
                    {/*
                    <DatePickerInput
                        label="Due Date"
                        placeholder="Pick a due date"
                        value={ dueDate }
                        onChange={ setDueDate }
                        required
                        mb="md"
                    /> */}

                    <Group justify="flex-end" mt="lg">
                        <Button type="submit" leftSection={ <IconClipboardPlus size={ 18 } /> }>
                            Create Task
                        </Button>
                    </Group>

                    { success && (
                        <Text c="green" mt="md" fw={ 500 }>
                            ✅ Task created successfully!
                        </Text>
                    ) }
                </form>
            </Card>
        </Box>
    );
};

export default CreateTask;
