import { useEffect, useState } from "react"
import { fetchWrapper } from "../../lib/api/fetchWrapper"
import { toast } from "react-toastify"

const AdminOverView = () =>
{

    const [ data, setData ] = useState( {
        faculty: 0,
        course: 0
    } )

    useEffect( () =>
    {
        getAllFacultyData()
        getAllCourseData()
    }, [] )

    const getAllCourseData = () =>
    {
        fetchWrapper( "adminAuth/totalCourses" ).then( ( resp ) =>
        {
            setData( ( prev ) => ( {
                ...prev,
                course: resp.totalCourses || 0,
            } ) );
        } ).catch( ( err ) =>
        {
            toast.error( err.message.message )
        } )
    }

    const getAllFacultyData = () =>
    {
        fetchWrapper( "adminAuth/adminGetAllFaculty" ).then( ( resp ) =>
        {
            setData( ( prev ) => ( {
                ...prev,
                faculty: resp.length || 0,
            } ) );
        } ).catch( ( err ) =>
        {
            toast.error( err.message )
        } )
    }

    return <div style={ { display: "flex" } }>

        <div style={ { width: "85%", padding: '10px' } }>
            <div style={ { display: 'flex', gap: '10px' } }>
                <div style={ { width: '50%', maxHeight: 'fit-content', border: '1px solid black', borderRadius: '20px' } }>
                    <p style={ { fontSize: '20px', fontWeight: '700' } }>Overview</p>
                    <div style={ { display: 'flex', flexDirection: 'column', justifySelf: 'start', gap: '5px', padding: '5px' } }>
                        <p>1. Total Faculty: <b>{ data.faculty }</b></p>
                        <p>2. Total Courses: <b>{ data.course }</b></p>
                    </div>
                </div>
                <div style={ { padding: '10px', maxWidth: '50%', maxHeight: 'fit-content', border: '1px solid black', borderRadius: '20px' } }>
                    <p style={ { fontSize: '20px', fontWeight: '700' } }>Quick Actions</p>
                    <div style={ { display: 'flex', flexDirection: 'column', width: '150px', gap: '20px' } }>
                        <button>Add Courses</button>
                        <button>Generate Report</button>
                    </div>
                </div>
            </div>
        </div >
    </div >
}

export default AdminOverView