import { useState } from "react";
import { toast } from "react-toastify";

const ManageCourse = () =>
{
    const [ faculty, setFaculty ] = useState( '' );
    const [ course, setCourse ] = useState( '' );
    const [ enrollmentCode, setEnrollmentCode ] = useState( '' );


    const facultyList = [ 'John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown' ];
    const courseList = [ 'Mathematics', 'Physics', 'Computer Science', 'Chemistry' ];


    const handleSubmit = ( e ) =>
    {
        e.preventDefault();
        if ( faculty && course )
        {
            toast.success( `Assigned ${ course } to ${ faculty } ` )
            setFaculty( '' );
            setCourse( '' );
        } else
        {
            toast.error( "Please fill all fields before submitting." )
        }
    };

    return <div>
        <h3>Add Course</h3>
        <div style={ { display: 'flex', gap: '10px', justifySelf: 'center' } }>
            <input
                type="text"
                value={ enrollmentCode }
                onChange={ ( e ) => setEnrollmentCode( e.target.value ) }
                placeholder="Course Name"
                style={ { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '200px' } }
            />


            <button
                type="submit"
                style={ { padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' } }
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
                    <option key={ index } value={ fac }>{ fac }</option>
                ) ) }
            </select>


            <select
                value={ course }
                onChange={ ( e ) => setCourse( e.target.value ) }
                style={ { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' } }
            >
                <option value="">Select Course</option>
                { courseList.map( ( crs, index ) => (
                    <option key={ index } value={ crs }>{ crs }</option>
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