import { useEffect, useState } from "react";
import { Card, Table, Title, Text, Badge, Loader } from "@mantine/core";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { toast } from "react-toastify";

const Result = () =>
{
    const [ results, setResults ] = useState( [] );
    const [ loading, setLoading ] = useState( false );

    const getStatusBadge = ( status ) =>
    {
        if ( status === "Evaluated" )
            return <Badge color="teal" variant="light">Evaluated</Badge>;
        if ( status === "Submitted" )
            return <Badge color="yellow" variant="light">Pending</Badge>;
        return <Badge color="gray" variant="light">Unknown</Badge>;
    };

    const fetchResults = async () =>
    {
        try
        {
            setLoading( true );
            const resp = await fetchWrapper( "student/results" );
            if ( resp.success )
            {
                setResults( resp.results );
            } else
            {
                toast.error( "Failed to fetch results" );
            }
        } catch ( err )
        {
            console.error( "Error fetching results:", err );
            toast.error( "Server error while fetching results" );
        } finally
        {
            setLoading( false );
        }
    };

    useEffect( () =>
    {
        fetchResults();
    }, [] );

    if ( loading )
        return (
            <div style={ { textAlign: "center", padding: "40px" } }>
                <Loader color="blue" size="lg" />
                <Text mt="md">Loading your results...</Text>
            </div>
        );

    return (
        <div style={ { padding: "20px" } }>
            <Title order={ 2 } mb="lg">
                My Results
            </Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                { results.length > 0 ? (
                    <Table highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Course</Table.Th>
                                <Table.Th>Task</Table.Th>
                                <Table.Th>Marks</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>
                            { results.map( ( r ) => (
                                <Table.Tr key={ r.submissionId }>
                                    <Table.Td>
                                        <Text fw={ 500 }>
                                            { r.courseName } ({ r.courseCode })
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>{ r.taskTitle }</Table.Td>
                                    <Table.Td>
                                        { r.status === "Evaluated" ? (
                                            <Text fw={ 500 } c="green">
                                                { r.marks } / { r.totalMarks }
                                            </Text>
                                        ) : (
                                            <Text c="dimmed">Awaiting Evaluation</Text>
                                        ) }
                                    </Table.Td>
                                    <Table.Td>{ getStatusBadge( r.status ) }</Table.Td>
                                </Table.Tr>
                            ) ) }
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Text c="dimmed" ta="center">
                        No results available yet.
                    </Text>
                ) }
            </Card>
        </div>
    );
};

export default Result;
