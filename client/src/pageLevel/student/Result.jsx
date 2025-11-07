import { Card, Table, Title, Text, Badge } from "@mantine/core";

const Result = () =>
{
    // Mock data for demonstration — can be replaced by API data later
    const results = [
        {
            id: 1,
            course: "Data Structures",
            task: "Assignment 1: Linked Lists",
            marks: 85,
            total: 100,
            remarks: "Good implementation, minor optimization needed.",
            status: "Evaluated",
        },
        {
            id: 2,
            course: "Database Systems",
            task: "Mini Project: ER Diagram",
            marks: null,
            total: 100,
            remarks: "",
            status: "Pending",
        },
        {
            id: 3,
            course: "Operating Systems",
            task: "Scheduling Algorithms Report",
            marks: 90,
            total: 100,
            remarks: "Excellent work with proper diagrams.",
            status: "Evaluated",
        },
    ];

    // Helper to show badge color by status
    const getStatusBadge = ( status ) =>
    {
        if ( status === "Evaluated" )
            return <Badge color="teal" variant="light">Evaluated</Badge>;
        if ( status === "Pending" )
            return <Badge color="yellow" variant="light">Pending</Badge>;
        return <Badge color="gray" variant="light">Unknown</Badge>;
    };

    return (
        <div style={ { padding: "20px" } }>
            <Title order={ 2 } mb="lg">My Results</Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                { results.length > 0 ? (
                    <Table highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Course</Table.Th>
                                <Table.Th>Task</Table.Th>
                                <Table.Th>Marks</Table.Th>
                                <Table.Th>Remarks</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>
                            { results.map( ( r ) => (
                                <Table.Tr key={ r.id }>
                                    <Table.Td>
                                        <Text fw={ 500 }>{ r.course }</Text>
                                    </Table.Td>
                                    <Table.Td>{ r.task }</Table.Td>
                                    <Table.Td>
                                        { r.status === "Pending" ? (
                                            <Text c="dimmed">-</Text>
                                        ) : (
                                            <Text>
                                                { r.marks } / { r.total }
                                            </Text>
                                        ) }
                                    </Table.Td>
                                    <Table.Td>
                                        { r.status === "Pending" ? (
                                            <Text c="dimmed">Awaiting evaluation</Text>
                                        ) : (
                                            <Text>{ r.remarks }</Text>
                                        ) }
                                    </Table.Td>
                                    <Table.Td>{ getStatusBadge( r.status ) }</Table.Td>
                                </Table.Tr>
                            ) ) }
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Text c="dimmed" ta="center">No results available yet.</Text>
                ) }
            </Card>
        </div>
    );
};

export default Result;
