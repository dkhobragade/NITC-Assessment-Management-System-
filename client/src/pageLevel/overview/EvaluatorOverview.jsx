import { Card, Grid, Text, Title } from '@mantine/core';

const EvaluatorOverview = () =>
{
    const task_Assigned = 12;
    const totalStudent = 8;

    return <div style={ { padding: '20px' } }>
        <Title order={ 2 } mb="lg">Evaluator Overview</Title>

        <Grid gutter="xl">
            {/* Faculty Count Box */ }
            <Grid.Col span={ { base: 12, sm: 6 } }>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="lg" fw={ 500 } mb="xs">
                        Assigned Task
                    </Text>
                    <Title order={ 1 } c="blue">
                        { task_Assigned }
                    </Title>
                </Card>
            </Grid.Col>

            {/* Course Count Box */ }
            <Grid.Col span={ { base: 12, sm: 6 } }>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="lg" fw={ 500 } mb="xs">
                        Number of Assigned Student
                    </Text>
                    <Title order={ 1 } c="green">
                        { totalStudent }
                    </Title>
                </Card>
            </Grid.Col>
        </Grid>
    </div>
}

export default EvaluatorOverview