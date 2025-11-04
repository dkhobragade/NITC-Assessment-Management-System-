import { useState } from "react";
import { toast } from "react-toastify";
import { postWrapper } from "../../lib/api/postWrapper";
import { useEffect } from "react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";

const ManageCourse = () =>
{

    useEffect( () =>
    {
        getAllCourses()
        getAllFaculty()
    }, [] )

    const [ faculty, setFaculty ] = useState( '' );
    const [ course, setCourse ] = useState( '' );
    const [ courseName, setCourseName ] = useState( '' );
    const [ courseCode, setCourseCode ] = useState( '' );

    const [ courseList, setCourseList ] = useState( [] )
    const [ facultyList, setFacultyList ] = useState( [] )

    const getAllCourses = () =>
    {
        fetchWrapper( "adminAuth/coursesData" ).then( ( resp ) =>
        {
            setCourseList( resp.courses )
        } ).catch( ( err ) =>
        {
            toast.error( err.message.message )
        } )
    }

    const getAllFaculty = () =>
    {
        fetchWrapper( "adminAuth/adminGetAllFaculty" )
            .then( ( resp ) =>
            {
                setFacultyList( resp );
            } )
            .catch( ( err ) =>
            {
                console.error( err );
                toast.error( err.message || "Failed to fetch faculty data" );
            } );
    }


    const handleSubmit = ( e ) =>
    {
        e.preventDefault();
        if ( !faculty )
        {
            toast.error( 'Please Select the faculty' )
            return
        } else if ( !course )
        {
            toast.error( "Please select the course" )
            return
        }

        postWrapper( 'adminAuth/adminAssignCourse', {
            faculty: faculty,
            course: course
        } ).then( ( resp ) =>
        {
            if ( resp.message )
            {
                toast.success( resp.message )
            }
        } ).catch( ( resp ) =>
        {
            toast.error( resp.message )
        } ).finally( () =>
        {
            setFaculty( '' )
            setCourse( '' )
        } )
    };

    const handleAddCourse = () =>
    {
        postWrapper( 'adminAuth/adminAddCourses', {
            courseName: courseName,
            courseCode: courseCode
        } ).then( ( resp ) =>
        {

            if ( resp.message )
            {
                toast.success( resp.message )
            }
        } ).catch( ( resp ) =>
        {
            toast.error( resp.message )
        } ).finally( () =>
        {
            setCourseCode( '' )
            setCourseName( '' )
        } )
    }

    return <div>
        <h3>Add Course</h3>
        <div style={ { display: 'flex', gap: '10px', justifySelf: 'center' } }>
            <input
                type="text"
                value={ courseName }
                onChange={ ( e ) => setCourseName( e.target.value ) }
                placeholder="Course Name"
                style={ {
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '200px',
                } }
            />

            <input
                type="text"
                value={ courseCode }
                onChange={ ( e ) => setCourseCode( e.target.value ) }
                placeholder="Course Code"
                style={ {
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '200px',
                } }
            />

            <button
                type="submit"
                style={ {
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                } }
                onClick={ handleAddCourse }
            >
                Add Course
            </button>
        </div>
        <h3>Assign Course</h3>
        <form onSubmit={ handleSubmit } style={ { marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', justifySelf: 'center' } }>
            <select
                value={ faculty }
                onChange={ ( e ) => setFaculty( e.target.value ) }
                style={ { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' } }
            >
                <option value="">Select Faculty</option>
                { facultyList.map( ( fac, index ) => (
                    <option key={ index } value={ fac.id }>{ fac.fullName }</option>
                ) ) }
            </select>


            <select
                value={ course }
                onChange={ ( e ) => setCourse( e.target.value ) }
                style={ { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' } }
            >
                <option value="">Select Course</option>
                { courseList.map( ( crs, index ) => (
                    <option key={ index } value={ crs.courseCode }>
                        { crs.courseName }
                    </option>
                ) ) }
            </select>


            <button
                type="submit"
                style={ { padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' } }
            >
                Assign Course
            </button>
        </form>
    </div>
}

export default ManageCourse