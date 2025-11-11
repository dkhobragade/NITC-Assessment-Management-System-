import { useEffect, useState } from 'react';
import { Card, Title, TextInput, Textarea, Button, Group, Box, Text } from '@mantine/core';
import { DatePickerInput } from "@mantine/dates";
import { IconClipboardPlus } from '@tabler/icons-react';
import { fetchWrapper } from '../../lib/api/fetchWrapper';
import { toast } from 'react-toastify';
import { postWrapper } from '../../lib/api/postWrapper';

const CreateTask = () =>
{
    const [ title, setTitle ] = useState( '' );
    const [ description, setDescription ] = useState( '' );
    const [ dueDate, setDueDate ] = useState( null );
    const [ pdfFile, setPdfFile ] = useState( null );
    const [ isLoading, setIsLoading ] = useState( false )

    const [ assignedCourse, setAssignedCourse ] = useState( '' );
    const today = new Date();

    useEffect( () =>
    {
        getAssignedCourse();
    }, [] );

    const getAssignedCourse = () =>
    {
        fetchWrapper( 'faculty/assigned-courses' )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    const courseName = resp.assignedCourses[ 0 ]?.name || '-';
                    setAssignedCourse( courseName );

                    if ( courseName === '-' )
                    {
                        toast.info( 'No course has been assigned to you' );
                    }
                }
            } )
            .catch( ( err ) =>
            {
                toast.error( err.message );
            } );
    };

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();
        setIsLoading( true )
        if ( !title || !description || !dueDate )
        {
            toast.info( 'Please fill in all fields' );
            return;
        }

        if ( !pdfFile )
        {
            toast.info( 'Please upload a PDF file' );
            return;
        }

        const nativeDate = dueDate instanceof Date ? dueDate : new Date( dueDate );

        const formData = new FormData();
        formData.append( 'title', title );
        formData.append( 'description', description );
        formData.append( 'deadline', nativeDate.toISOString() );
        formData.append( 'pdfFile', pdfFile );

        try
        {
            const resp = await postWrapper( 'faculty/create-task', formData, true );

            if ( resp.success )
            {
                toast.success( resp.message );
                setTitle( '' );
                setDescription( '' );
                setDueDate( null );
                setPdfFile( null );
            }
        } catch ( err )
        {
            toast.error( err.message );
        } finally
        {
            setIsLoading( false )
        }
    };

    const isFormDisabled = assignedCourse === '-';

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Create New Task
            </Title>

            <Card shadow="sm" padding="xl" radius="md" withBorder maw={ 700 }>
                <form onSubmit={ handleSubmit }>
                    <Text fw={ 600 } mb="md">Assigned Course: { assignedCourse }</Text>

                    <TextInput
                        label="Title"
                        placeholder="Enter task title"
                        value={ title }
                        onChange={ ( e ) => setTitle( e.target.value ) }
                        required
                        mb="md"
                        disabled={ isFormDisabled }
                    />

                    <Textarea
                        label="Description"
                        placeholder="Enter detailed task description"
                        minRows={ 4 }
                        value={ description }
                        onChange={ ( e ) => setDescription( e.target.value ) }
                        required
                        mb="md"
                        disabled={ isFormDisabled }
                    />

                    <DatePickerInput
                        label="Due Date"
                        placeholder="Pick a due date"
                        value={ dueDate }
                        onChange={ setDueDate }
                        minDate={ today } // prevent backdates
                        required
                        mb="md"
                        disabled={ isFormDisabled }
                    />

                    <Box mb="md">
                        <Text fw={ 600 } size="sm" mb={ 4 }>Upload PDF</Text>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={ ( e ) => setPdfFile( e.target.files[ 0 ] ) }
                            disabled={ isFormDisabled }
                        />
                        { pdfFile && <Text size="sm" mt={ 2 }>Selected file: { pdfFile.name }</Text> }
                    </Box>

                    <Group justify="flex-end" mt="lg">
                        <Button
                            loading={ isLoading }
                            type="submit"
                            leftSection={ <IconClipboardPlus size={ 18 } /> }
                            disabled={ isFormDisabled }
                        >
                            Create Task
                        </Button>
                    </Group>
                </form>
            </Card>
        </Box>
    );
};

export default CreateTask;
