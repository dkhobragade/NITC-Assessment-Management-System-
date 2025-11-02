import Result from './Results'
import StudentOverView from './StudentOverView'
import Task from './Task'

const StudentSideBar = ( { selectedType } ) =>
{
    const renderSelectedType = () =>
    {
        if ( selectedType == "Overview" ) return <StudentOverView />
        else if ( selectedType == "Result" ) return <Result />
        else return <Task />
    }
    return <>{ renderSelectedType() }</>
}

export default StudentSideBar