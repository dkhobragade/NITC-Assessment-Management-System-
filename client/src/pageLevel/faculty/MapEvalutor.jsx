import { useState, useEffect } from "react";
import { Title, Container, Card, Button, Group, FileButton, Stack, Select, Table, ScrollArea } from "@mantine/core";
import { IconUpload, IconRefresh, IconUserCheck } from "@tabler/icons-react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { postWrapper } from "../../lib/api/postWrapper";
import { toast } from "react-toastify";

const FacultyDashboard = () =>
{

    const [ evaluatorFile, setEvaluatorFile ] = useState( null );
    const [ studentFile, setStudentFile ] = useState( null );

    const [ manualMappings, setManualMappings ] = useState( [] );
    const [ selectedEvaluator, setSelectedEvaluator ] = useState( "" );
    const [ selectedStudent, setSelectedStudent ] = useState( "" );

    const [ evaluators, setEvaluators ] = useState( [] );
    const [ students, setStudents ] = useState( [] );

    const [ evaluatorsList, setEvaluatorsList ] = useState( [] );
    const [ studentList, setStudentList ] = useState( [] );

    useEffect( () =>
    {
        fetchEvaluators()
        fetchStudent()
    }, [] );

    const fetchStudent = () =>
    {
        fetchWrapper( "faculty/students" )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    setStudentList( resp.student.map( ( e ) => ( {
                        value: e._id,
                        label: `${ e.name }`
                    } ) ) );
                }
            } )
            .catch( ( error ) =>
            {
                toast.error( error.message );
            } )

    };

    const fetchEvaluators = () =>
    {
        fetchWrapper( "faculty/evalutors" )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    if ( !resp.evalutor || resp.evalutor.length === 0 )
                    {
                        setEvaluatorsList( [] );
                    } else
                    {
                        setEvaluatorsList( resp.evalutor.map( ( e ) => ( {
                            value: e._id,
                            label: `${ e.name }`
                        } ) ) );
                    }
                }
            } )
            .catch( ( error ) =>
            {
                toast.error( error.message );
            } )
    }

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

        const evaluatorObj = evaluatorsList.find( ( e ) => e.value === selectedEvaluator );
        const studentObj = studentList.find( ( s ) => s.value === selectedStudent );

        if ( !evaluatorObj || !studentObj ) return;

        // Add mapping
        setManualMappings( [ ...manualMappings, {
            evaluatorId: evaluatorObj.value,
            studentId: studentObj.value,
            evaluatorName: evaluatorObj.label,
            studentName: studentObj.label,
        } ] );

        // Remove student from dropdown to prevent double mapping
        setStudentList( studentList.filter( ( s ) => s.value !== selectedStudent ) );

        // Reset selects
        setSelectedEvaluator( "" );
        setSelectedStudent( "" );
    };

    const handleSaveMappings = async () =>
    {
        if ( manualMappings.length === 0 ) return;

        for ( const mapping of manualMappings )
        {
            try
            {
                const resp = await postWrapper( "faculty/save-mappings", {
                    evaluatorId: mapping.evaluatorId,
                    studentId: mapping.studentId,
                } );

                if ( resp.success )
                {
                    toast.success( `Mapping saved: ${ mapping.evaluatorName } → ${ mapping.studentName }` );
                }
            } catch ( err )
            {
                toast.error( `Failed to save mapping: ${ mapping.evaluatorName } → ${ mapping.studentName }` );
            }
        }

        // After all mappings saved
        setManualMappings( [] );
        setStudentList( students.map( ( s ) => ( { value: s._id, label: s.name } ) ) );
    };




    return (
        <Container size="xl" py="lg">
            <Stack spacing="lg">

                {/* <Card shadow="sm" padding="lg" radius="md" withBorder>
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
                </Card> */}

                {/* Mapping */ }
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={ 4 }>Mapping Evaluators → Students</Title>
                    <Group mb="md">
                        <Select
                            label="Evaluator"
                            placeholder="Select evaluator"
                            data={ evaluatorsList }
                            value={ selectedEvaluator }
                            onChange={ setSelectedEvaluator }
                            required
                            mb="md"
                        />
                        <Select
                            mb="md"
                            required
                            label="Student"
                            placeholder="Select student"
                            data={ studentList }
                            value={ selectedStudent }
                            onChange={ setSelectedStudent }
                        />
                        <Button onClick={ handleManualMapping } leftIcon={ <IconUserCheck /> }>Assign</Button>

                        <Button
                            color="teal"
                            onClick={ () =>
                            {
                                if ( evaluatorsList.length === 0 || studentList.length === 0 ) return;

                                const remainingStudents = [ ...studentList ]; // students to map
                                const newMappings = [];

                                while ( remainingStudents.length > 0 )
                                {
                                    // Pick a random student
                                    const studentIdx = Math.floor( Math.random() * remainingStudents.length );
                                    const student = remainingStudents.splice( studentIdx, 1 )[ 0 ];

                                    // Pick a random evaluator
                                    const evaluatorIdx = Math.floor( Math.random() * evaluatorsList.length );
                                    const evaluator = evaluatorsList[ evaluatorIdx ];

                                    // Add mapping
                                    newMappings.push( {
                                        evaluatorId: evaluator.value,
                                        studentId: student.value,
                                        evaluatorName: evaluator.label,
                                        studentName: student.label,
                                    } );
                                }

                                // Add to manualMappings
                                setManualMappings( [ ...manualMappings, ...newMappings ] );

                                // Remove mapped students from dropdown
                                const mappedStudentIds = newMappings.map( ( m ) => m.studentId );
                                setStudentList( studentList.filter( ( s ) => !mappedStudentIds.includes( s.value ) ) );

                                toast.success( "Random mapping completed!" );
                            } }
                        >
                            Random Map
                        </Button>

                    </Group>

                    { manualMappings.length > 0 && (
                        <Card shadow="sm" padding="lg" radius="md" withBorder mt="md">
                            <Title order={ 5 } mb="md">Current Mappings</Title>
                            <ScrollArea>
                                <Table striped highlightOnHover verticalSpacing="sm">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Evaluator</th>
                                            <th>Student</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { manualMappings.map( ( m, i ) => (
                                            <tr key={ i }>
                                                <td>{ i + 1 }</td>
                                                <td>{ m.evaluatorName }</td>
                                                <td>{ m.studentName }</td>
                                            </tr>
                                        ) ) }
                                    </tbody>
                                </Table>
                            </ScrollArea>
                            <Group position="right" mt="md">
                                <Button color="blue" onClick={ handleSaveMappings }>
                                    Save Mappings
                                </Button>
                            </Group>
                        </Card>
                    ) }

                </Card>
            </Stack>
        </Container>
    );
};

export default FacultyDashboard;
