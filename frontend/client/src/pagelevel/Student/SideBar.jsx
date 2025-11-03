import Result from './Results'
import StudentOverView from './StudentOverView'

const StudentSideBar = ( { selectedType } ) =>
{
    const renderSelectedType = () =>
    {
        if ( selectedType == "Overview" ) return <StudentOverView />
        else if ( selectedType == "Result" ) return <Result />
    }
    return <>{ renderSelectedType() }</>
}

export default StudentSideBar