import { useState } from "react";
import
{
    Card,
    Title,
    Text,
    Grid,
    Button,
    Group,
    FileButton,
    Notification,
} from "@mantine/core";
import { IconUpload, IconCheck, IconFileText } from "@tabler/icons-react";

const Task = () =>
{
    // Mock data for tasks (replace with API data later)
    const tasks = [
        {
            id: 1,
            course: "Data Structures",
            title: "Assignment 1: Linked Lists",
            description:
                "Implement a linked list with basic operations: insertion, deletion, traversal, and reversal.",
            deadline: "2025-11-20",
        },
        {
            id: 2,
            course: "Database Systems",
            title: "Mini Project: ER Diagram",
            description:
                "Design an ER diagram for a library management system and explain relationships.",
            deadline: "2025-11-25",
        },
    ];

    const [ uploadedFiles, setUploadedFiles ] = useState( {} );
    const [ showNotification, setShowNotification ] = useState( false );

    const handleFileUpload = ( taskId, file ) =>
    {
        setUploadedFiles( ( prev ) => ( { ...prev, [ taskId ]: file.name } ) );
        setShowNotification( true );

        // Here, you can integrate API upload logic:
        // const formData = new FormData();
        // formData.append("file", file);
        // await axios.post(`${BASEURL}/student/upload/${taskId}`, formData)
    };

    return (
        <div style={ { padding: "20px" } }>
            <Title order={ 2 } mb="lg">
                My Tasks
            </Title>

            <Grid gutter="lg">
                { tasks.map( ( task ) => (
                    <Grid.Col span={ { base: 12, md: 6 } } key={ task.id }>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={ 4 } mb="sm" c="blue">
                                { task.title }
                            </Title>
                            <Text fw={ 500 } mb="xs">
                                Course: { task.course }
                            </Text>
                            <Text size="sm" mb="sm">
                                { task.description }
                            </Text>
                            <Text size="sm" c="dimmed" mb="md">
                                Deadline: <b>{ task.deadline }</b>
                            </Text>

                            <Group>
                                <FileButton onChange={ ( file ) => handleFileUpload( task.id, file ) } accept="application/pdf">
                                    { ( props ) => (
                                        <Button { ...props } leftSection={ <IconUpload size={ 16 } /> } color="blue" variant="light">
                                            Upload PDF
                                        </Button>
                                    ) }
                                </FileButton>

                                { uploadedFiles[ task.id ] && (
                                    <Text size="sm" c="green">
                                        <IconFileText size={ 16 } style={ { verticalAlign: "middle" } } />{ " " }
                                        { uploadedFiles[ task.id ] }
                                    </Text>
                                ) }
                            </Group>
                        </Card>
                    </Grid.Col>
                ) ) }
            </Grid>

            { showNotification && (
                <Notification
                    icon={ <IconCheck size={ 18 } /> }
                    color="teal"
                    title="Upload Successful"
                    mt="xl"
                    onClose={ () => setShowNotification( false ) }
                >
                    Your task file has been successfully uploaded!
                </Notification>
            ) }
        </div>
    );
};

export default Task;
