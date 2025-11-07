import { Card, Grid, Text, Title } from '@mantine/core';

const FacultyOverview = () =>
{

    const assignedCourse = 12;
    const taskCreated = 8;


    return <div style={ { padding: '20px' } }>
        <Title order={ 2 } mb="lg">Faculty Overview</Title>

        <Grid gutter="xl">
            {/* Assigned Course  */ }
            <Grid.Col span={ { base: 12, sm: 6 } }>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="lg" fw={ 500 } mb="xs">
                        Assigned Course
                    </Text>
                    <Title order={ 1 } c="blue">
                        { assignedCourse }
                    </Title>
                </Card>
            </Grid.Col>

            {/* Task Count Box */ }
            <Grid.Col span={ { base: 12, sm: 6 } }>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="lg" fw={ 500 } mb="xs">
                        Total Task
                    </Text>
                    <Title order={ 1 } c="green">
                        { taskCreated }
                    </Title>
                </Card>
            </Grid.Col>
        </Grid>
    </div>
}

export default FacultyOverview