import { useEffect, useState } from "react";
import { Table, Title, Container, Button, Badge, Loader, Group, Text, Paper } from "@mantine/core";
import { toast } from "react-toastify";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { putWrapper } from "../../lib/api/putWrapper";
import { getFileWrapper } from "../../lib/api/getFileWrapper";


const GenerateReport = () =>
{
    const [ facultyList, setFacultyList ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const [ updating, setUpdating ] = useState( null );

    useEffect( () =>
    {
        fetchFaculty();
    }, [] );

    const fetchFaculty = () =>
    {

        setLoading( true );
        fetchWrapper( "admin/faculties" ).then( ( resp ) =>
        {
            if ( resp )
            {
                setFacultyList( resp.faculty )
            }
        } ).catch( ( error ) =>
        {
            toast.error( error.message )

        } ).finally( () =>
        {
            setLoading( false )
        } )

    }

    const handleGenerateReport = async ( facultyId, facultyName ) =>
    {
        setUpdating( facultyId );
        try
        {
            await getFileWrapper(
                `admin/generate-faculty-report/${ facultyId }`,
                `Faculty_Report_${ facultyName }.pdf`
            );
            toast.success( `Report generated for ${ facultyName }` );
        } catch ( err )
        {
            toast.error( err.message || "Failed to generate report" );
        } finally
        {
            setUpdating( null );
        }
    };

    // 🔹 Table Rows
    const rows = facultyList.map( ( faculty ) => (
        <Table.Tr key={ faculty._id }>
            <Table.Td>{ faculty.name }</Table.Td>
            <Table.Td>{ faculty.email }</Table.Td>
            <Table.Td>{ faculty.collegeId }</Table.Td>
            <Table.Td>
                { faculty.assignedCourses?.length > 0 ? (
                    faculty.assignedCourses.map( ( course ) => (
                        <Badge key={ course._id } color="blue" mr="xs">
                            { course.name }
                        </Badge>
                    ) )
                ) : (
                    <Text c="dimmed" size="sm">
                        None
                    </Text>
                ) }
            </Table.Td>
            <Table.Td>
                <Button
                    size="xs"
                    color="blue"
                    loading={ updating === faculty._id }
                    onClick={ () => handleGenerateReport( faculty._id, faculty.name ) }
                >
                    Generate Report
                </Button>
            </Table.Td>
        </Table.Tr>
    ) );

    return (
        <Container size="xl" py="lg">
            <Title order={ 2 } mb="lg" ta="left">
                Report Generation
            </Title>

            { loading ? (
                <Group justify="center" mt="xl">
                    <Loader size="lg" />
                </Group>
            ) : (
                <Paper shadow="sm" p="md" radius="md" withBorder>
                    { facultyList.length === 0 ? (
                        <Text ta="center" c="dimmed">
                            No faculty found.
                        </Text>
                    ) : (
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>College ID</Table.Th>
                                    <Table.Th>Assigned Courses</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{ rows }</Table.Tbody>
                        </Table>
                    ) }
                </Paper>
            ) }
        </Container>
    );
};

export default GenerateReport;
