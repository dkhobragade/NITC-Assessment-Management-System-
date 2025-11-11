import { useState, useEffect } from "react";
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
    Loader,
    Notification,
} from "@mantine/core";
import { IconFileText, IconCheck } from "@tabler/icons-react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { postWrapper } from "../../lib/api/postWrapper";
import { toast } from "react-toastify";

const AssignedStudent = () =>
{
    const [ studentSubmissions, setStudentSubmissions ] = useState( [] );
    const [ loading, setLoading ] = useState( false );
    const [ notification, setNotification ] = useState( null );

    // ✅ Fetch assigned students + their submissions
    const getAllAssignedStudentDetails = async () =>
    {
        try
        {
            setLoading( true );
            const resp = await fetchWrapper( "evaluator/assigned-students" );

            if ( resp.success )
            {
                const formatted = [];

                resp.assignedStudents.forEach( ( student ) =>
                {
                    student.submissions.forEach( ( sub ) =>
                    {
                        formatted.push( {
                            uniqueKey: `${ student._id }-${ sub.submissionId }`, // ✅ absolutely unique key
                            submissionId: sub.submissionId,
                            studentId: student._id,
                            studentName: student.name,
                            rollNo: student.collegeId,
                            taskTitle: sub.taskTitle || "Untitled Task",
                            pdfUrl: sub.fileUrl,
                            marks: sub.marks || "",
                            status: sub.status,
                            submittedAt: sub.submittedAt,
                        } );
                    } );
                } );

                // ✅ Create a new array copy (no shared refs)
                setStudentSubmissions( [ ...formatted ] );
            } else
            {
                toast.error( "Failed to fetch assigned students" );
            }
        } catch ( error )
        {
            console.error( "Error fetching assigned students:", error );
            toast.error( "Server error while fetching assigned students" );
        } finally
        {
            setLoading( false );
        }
    };

    // ✅ Handle marks change per submission
    const handleMarksChange = ( uniqueKey, value ) =>
    {
        setStudentSubmissions( ( prev ) =>
            prev.map( ( s ) =>
                s.uniqueKey === uniqueKey ? { ...s, marks: value } : s
            )
        );
    };

    // ✅ Submit marks for each graded submission
    const handleSubmitMarks = async () =>
    {
        try
        {
            const graded = studentSubmissions.filter(
                ( s ) => s.marks !== "" && !isNaN( Number( s.marks ) )
            );

            if ( !graded.length )
            {
                toast.warning( "Please enter marks for at least one student" );
                return;
            }

            for ( const s of graded )
            {
                await postWrapper( `evaluator/assign-marks/${ s.submissionId }`, {
                    marks: Number( s.marks ),
                } );
            }

            setNotification( {
                color: "green",
                message: "Marks submitted successfully!",
            } );

            await getAllAssignedStudentDetails();
        } catch ( err )
        {
            console.error( "Error submitting marks:", err );
            setNotification( { color: "red", message: "Failed to submit marks." } );
        }
    };

    useEffect( () =>
    {
        getAllAssignedStudentDetails();
    }, [] );

    if ( loading )
        return (
            <Box p="lg" style={ { textAlign: "center" } }>
                <Loader color="blue" size="lg" />
                <Text mt="md">Loading assigned students...</Text>
            </Box>
        );

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Evaluate Assigned Student Submissions
            </Title>

            <Card shadow="sm" padding="xl" radius="md" withBorder>
                { studentSubmissions.length > 0 ? (
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Roll No</Table.Th>
                                <Table.Th>Student Name</Table.Th>
                                <Table.Th>Task Title</Table.Th>
                                <Table.Th>Submission</Table.Th>
                                <Table.Th>Submitted At</Table.Th>
                                <Table.Th>Marks</Table.Th>
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>
                            { studentSubmissions.map( ( sub ) => (
                                <Table.Tr key={ sub.uniqueKey }>
                                    <Table.Td>{ sub.rollNo }</Table.Td>
                                    <Table.Td>{ sub.studentName }</Table.Td>
                                    <Table.Td>{ sub.taskTitle }</Table.Td>
                                    <Table.Td>
                                        { sub.pdfUrl ? (
                                            <Button
                                                component="a"
                                                href={ sub.pdfUrl }
                                                target="_blank"
                                                variant="light"
                                                color="blue"
                                                leftSection={ <IconFileText size={ 16 } /> }
                                            >
                                                View PDF
                                            </Button>
                                        ) : (
                                            <Text c="dimmed">No file uploaded</Text>
                                        ) }
                                    </Table.Td>
                                    <Table.Td>
                                        { new Date( sub.submittedAt ).toLocaleDateString() }
                                    </Table.Td>
                                    <Table.Td>
                                        { sub.status === "Evaluated" && sub.marks !== null ? (
                                            <Text fw={ 500 } c="green">
                                                { sub.marks }
                                            </Text>
                                        ) : (
                                            <TextInput
                                                key={ sub.uniqueKey }
                                                placeholder="Marks"
                                                type="number"
                                                value={ sub.marks || "" }
                                                onChange={ ( e ) =>
                                                    handleMarksChange( sub.uniqueKey, e.currentTarget.value )
                                                }
                                                w={ 80 }
                                            />
                                        ) }
                                    </Table.Td>
                                </Table.Tr>
                            ) ) }
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Text c="dimmed" mt="md">
                        No submissions found for your assigned students.
                    </Text>
                ) }
            </Card>

            { studentSubmissions.length > 0 && (
                <Group justify="flex-end" mt="lg">
                    <Button
                        leftSection={ <IconCheck size={ 18 } /> }
                        color="green"
                        onClick={ handleSubmitMarks }
                    >
                        Submit Marks
                    </Button>
                </Group>
            ) }

            { notification && (
                <Notification
                    color={ notification.color }
                    mt="xl"
                    title="Status"
                    onClose={ () => setNotification( null ) }
                >
                    { notification.message }
                </Notification>
            ) }
        </Box>
    );
};

export default AssignedStudent;
