import { useState, useEffect } from "react";
import { Title, Container, Grid, Card, Text, Button, Group, FileButton, Stack, Select, Table } from "@mantine/core";
import { IconUpload, IconRefresh, IconUserCheck } from "@tabler/icons-react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { postWrapper } from "../../lib/api/postWrapper";

const FacultyDashboard = () =>
{
    const [ tasks, setTasks ] = useState( [] );
    const [ taskCount, setTaskCount ] = useState( 0 );
    const [ loading, setLoading ] = useState( true );

    const [ evaluatorFile, setEvaluatorFile ] = useState( null );
    const [ studentFile, setStudentFile ] = useState( null );

    const [ manualMappings, setManualMappings ] = useState( [] );
    const [ selectedEvaluator, setSelectedEvaluator ] = useState( "" );
    const [ selectedStudent, setSelectedStudent ] = useState( "" );

    const [ evaluators, setEvaluators ] = useState( [] );
    const [ students, setStudents ] = useState( [] );

    useEffect( () =>
    {
        fetchTasks();
    }, [] );

    const fetchTasks = async () =>
    {
        setLoading( true );
        try
        {
            const resp = await fetchWrapper( "faculty/faculty-tasks" );
            if ( resp.success )
            {
                setTasks( resp.tasks );
                setTaskCount( resp.taskCount );
            }
        } catch ( err )
        {
            console.error( err );
        } finally
        {
            setLoading( false );
        }
    };

    const handleUploadExcel = async () =>
    {
        if ( !evaluatorFile || !studentFile )
        {
            alert( "Please select both evaluator and student files" );
            return;
        }

        const formData = new FormData();
        formData.append( "evaluators", evaluatorFile );
        formData.append( "students", studentFile );

        try
        {
            const resp = await postWrapper( "faculty/upload-excel", formData, true ); // pass true for FormData
            if ( resp.success )
            {
                alert( "Files uploaded and users saved successfully!" );
                setEvaluators( resp.evaluators );
                setStudents( resp.students );
            }
        } catch ( err )
        {
            console.error( err );
            alert( "File upload failed!" );
        }
    };


    const handleRandomMapping = async () =>
    {
        try
        {
            await postWrapper( "faculty/random-map", {} );
            alert( "Random mapping completed!" );
        } catch ( err )
        {
            console.error( err );
            alert( "Mapping failed" );
        }
    };

    const handleManualMapping = () =>
    {
        if ( !selectedEvaluator || !selectedStudent ) return;

        const newMap = {
            evaluator: evaluators.find( ( e ) => e._id === selectedEvaluator )?.name,
            student: students.find( ( s ) => s._id === selectedStudent )?.name,
        };
        setManualMappings( [ ...manualMappings, newMap ] );
        setSelectedEvaluator( "" );
        setSelectedStudent( "" );
    };

    return (
        <Container size="xl" py="lg">
            <Stack spacing="lg">

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={ 4 }>Upload Excel Files</Title>
                    <Group>
                        <FileButton onChange={ setEvaluatorFile } accept=".xlsx,.csv">
                            { ( props ) => <Button { ...props } leftIcon={ <IconUpload /> }>Upload Evaluator</Button> }
                        </FileButton>
                        <FileButton onChange={ setStudentFile } accept=".xlsx,.csv">
                            { ( props ) => <Button { ...props } leftIcon={ <IconUpload /> }>Upload Student</Button> }
                        </FileButton>
                        <Button onClick={ handleUploadExcel }>Save</Button>
                    </Group>
                </Card>

                {/* Mapping */ }
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={ 4 }>Mapping Evaluators → Students</Title>
                    <Group mb="md">
                        <Select
                            label="Evaluator"
                            placeholder="Select evaluator"
                            data={ evaluators.map( ( e ) => ( { value: e._id, label: e.name } ) ) }
                            value={ selectedEvaluator }
                            onChange={ setSelectedEvaluator }
                        />
                        <Select
                            label="Student"
                            placeholder="Select student"
                            data={ students.map( ( s ) => ( { value: s._id, label: s.name } ) ) }
                            value={ selectedStudent }
                            onChange={ setSelectedStudent }
                        />
                        <Button onClick={ handleManualMapping } leftIcon={ <IconUserCheck /> }>Assign</Button>
                    </Group>
                    <Button onClick={ handleRandomMapping } leftIcon={ <IconRefresh /> }>Random Mapping</Button>

                    { manualMappings.length > 0 && (
                        <Table striped highlightOnHover mt="md">
                            <thead>
                                <tr>
                                    <th>Evaluator</th>
                                    <th>Student</th>
                                </tr>
                            </thead>
                            <tbody>
                                { manualMappings.map( ( m, i ) => (
                                    <tr key={ i }>
                                        <td>{ m.evaluator }</td>
                                        <td>{ m.student }</td>
                                    </tr>
                                ) ) }
                            </tbody>
                        </Table>
                    ) }
                </Card>
            </Stack>
        </Container>
    );
};

export default FacultyDashboard;
