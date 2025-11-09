import { useEffect, useState } from "react";
import { Table, Title, Container, Button, Badge, Loader, Group, Text, Paper } from "@mantine/core";
import { toast } from "react-toastify";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { putWrapper } from "../../lib/api/putWrapper";

const ManageEvaluator = () =>
{
    const [ evaluatorsList, setEvaluatorsList ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const [ updating, setUpdating ] = useState( null );

    useEffect( () =>
    {
        fetchEvaluators();
    }, [] );

    const fetchEvaluators = () =>
    {
        setLoading( true );
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
                        setEvaluatorsList( resp.evalutor );
                    }
                }
            } )
            .catch( ( error ) =>
            {
                toast.error( error.message );
            } )
            .finally( () =>
            {
                setLoading( false );
            } );
    };

    const handleApprove = ( id ) =>
    {
        setUpdating( id )
        putWrapper( `faculty/approve-evaluator/${ id }` ).then( ( resp ) =>
        {

            if ( resp.success )
            {
                toast.success( resp.message )
                fetchEvaluators()
            }
        } ).catch( ( err ) =>
        {
            toast.error( err.message )
        } ).finally( () =>
        {
            setUpdating( null )
        } )
    };

    const rows = evaluatorsList.map( ( evaluator ) => (
        <Table.Tr key={ evaluator._id }>
            <Table.Td>{ evaluator.name }</Table.Td>
            <Table.Td>{ evaluator.email }</Table.Td>
            <Table.Td>{ evaluator.collegeId }</Table.Td>
            <Table.Td>
                { evaluator.isApproved ? (
                    <Badge color="green" variant="filled">
                        Approved
                    </Badge>
                ) : (
                    <Button
                        size="xs"
                        color="blue"
                        loading={ updating === evaluator._id }
                        onClick={ () => handleApprove( evaluator._id ) }
                    >
                        Approve
                    </Button>
                ) }
            </Table.Td>
        </Table.Tr>
    ) );

    return (
        <Container size="xl" py="lg">
            <Title order={ 2 } mb="lg" ta="left">
                Manage Evaluators
            </Title>

            { loading ? (
                <Group justify="center" mt="xl">
                    <Loader size="lg" />
                </Group>
            ) : (
                <Paper shadow="sm" p="md" radius="md" withBorder>
                    { evaluatorsList.length === 0 ? (
                        <Text ta="center" c="dimmed">
                            No evaluator data found.
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
        </Container>
    );
};

export default ManageEvaluator;
