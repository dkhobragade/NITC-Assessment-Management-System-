import { useEffect, useState } from "react";
import { Table, Title, Container, Button, Badge, Loader, Group, Text, Paper, Stack } from "@mantine/core";
import { toast } from "react-toastify";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { putWrapper } from "../../lib/api/putWrapper";

const ManageStudent = () =>
{
    const [ studentList, setStudentList ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const [ updating, setUpdating ] = useState( null );

    useEffect( () =>
    {
        fetchStudent();
    }, [] );

    const fetchStudent = () =>
    {
        setLoading( true );
        fetchWrapper( "faculty/students" )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    setStudentList( resp.student || [] );
                }
            } )
            .catch( ( error ) =>
            {
                toast.error( error.message );
            } )
            .finally( () => setLoading( false ) );
    };

    const handleApprove = ( id ) =>
    {
        setUpdating( id );
        putWrapper( `faculty/approve-student/${ id }` )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    toast.success( resp.message );
                    fetchStudent();
                }
            } )
            .catch( ( err ) => toast.error( err.message ) )
            .finally( () => setUpdating( null ) );
    };

    const handleExportExcel = async () =>
    {
        try
        {
            const blob = await fetchWrapper( "faculty/export-students", {}, true );
            const url = window.URL.createObjectURL( blob );
            const a = document.createElement( "a" );
            a.href = url;
            a.download = "students.xlsx";
            document.body.appendChild( a );
            a.click();
            a.remove();
            window.URL.revokeObjectURL( url );
        } catch ( err )
        {
            console.error( err );
            toast.error( "Failed to download Excel file" );
        }
    };


    const rows = studentList.map( ( student ) => (
        <Table.Tr key={ student._id }>
            <Table.Td>{ student.name }</Table.Td>
            <Table.Td>{ student.email }</Table.Td>
            <Table.Td>{ student.collegeId }</Table.Td>
            <Table.Td>
                { student.isApproved ? (
                    <Badge color="green" variant="filled">
                        Approved
                    </Badge>
                ) : (
                    <Button
                        size="xs"
                        color="blue"
                        loading={ updating === student._id }
                        onClick={ () => handleApprove( student._id ) }
                    >
                        Approve
                    </Button>
                ) }
            </Table.Td>
        </Table.Tr>
    ) );

    return (
        <Container size="xl" py="lg">
            <Stack spacing="md">
                <Group position="apart">
                    <Title order={ 2 } mb="lg" ta="left">
                        Manage Students
                    </Title>
                    <Button color="green" onClick={ handleExportExcel }>
                        Export to Excel
                    </Button>
                </Group>

                { loading ? (
                    <Group justify="center" mt="xl">
                        <Loader size="lg" />
                    </Group>
                ) : (
                    <Paper shadow="sm" p="md" radius="md" withBorder>
                        { studentList.length === 0 ? (
                            <Text ta="center" c="dimmed">
                                No student data found.
                            </Text>
                        ) : (
                            <Table striped highlightOnHover withTableBorder>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Name</Table.Th>
                                        <Table.Th>Email</Table.Th>
                                        <Table.Th>College ID</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{ rows }</Table.Tbody>
                            </Table>
                        ) }
                    </Paper>
                ) }
            </Stack>
        </Container>
    );
};

export default ManageStudent;
