import { Card, Grid, Text, Title } from '@mantine/core';

const AdminOverview = () =>
{
    // For now, static values — later you can fetch from API
    const totalFaculty = 12;
    const totalCourses = 8;

    return (
        <div style={ { padding: '20px' } }>
            <Title order={ 2 } mb="lg">Admin Overview</Title>

            <Grid gutter="xl">
                {/* Faculty Count Box */ }
                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={ 500 } mb="xs">
                            Total Faculty
                        </Text>
                        <Title order={ 1 } c="blue">
                            { totalFaculty }
                        </Title>
                    </Card>
                </Grid.Col>

                {/* Course Count Box */ }
                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={ 500 } mb="xs">
                            Total Courses
                        </Text>
                        <Title order={ 1 } c="green">
                            { totalCourses }
                        </Title>
                    </Card>
                </Grid.Col>
            </Grid>
        </div>
    );
};

export default AdminOverview;
