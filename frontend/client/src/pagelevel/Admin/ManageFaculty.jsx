import { useState } from "react";

export default function AdminUsersTable ()
{
    const [ users, setUsers ] = useState( [
        { id: "U1001", name: "Alice Johnson", course: "B.Tech CSE", approved: false },
        { id: "U1002", name: "Bob Kumar", course: "B.Sc Mathematics", approved: true },
        { id: "U1003", name: "Carla Mendes", course: "MBA", approved: false },
        { id: "U1004", name: "David Lee", course: "M.Tech ECE", approved: true },
    ] );

    const toggleApprove = ( id ) =>
    {
        setUsers( ( prev ) => prev.map( ( u ) => ( u.id === id ? { ...u, approved: !u.approved } : u ) ) );
    };

    return (
        <div style={ { padding: '20px', fontFamily: 'Arial, sans-serif' } }>
            <div style={ { display: 'flex', justifyContent: 'end', } }>
                <input
                    type="text"
                    placeholder="Search by name or id"
                    style={ {
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        width: '250px'
                    } }
                    onChange={ ( e ) =>
                    {
                        const q = e.target.value.trim().toLowerCase();
                        const base = [
                            { id: "U1001", name: "Alice Johnson", course: "B.Tech CSE", approved: false },
                            { id: "U1002", name: "Bob Kumar", course: "B.Sc Mathematics", approved: true },
                            { id: "U1003", name: "Carla Mendes", course: "MBA", approved: false },
                            { id: "U1004", name: "David Lee", course: "M.Tech ECE", approved: true },
                        ];
                        if ( !q ) return setUsers( base );
                        setUsers( base.filter( ( u ) => u.name.toLowerCase().includes( q ) || u.id.toLowerCase().includes( q ) ) );
                    } }
                />
            </div>
            <table style={ { width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' } }>
                <thead style={ { backgroundColor: '#f8f8f8' } }>
                    <tr>
                        <th style={ headerStyle }>Name</th>
                        <th style={ headerStyle }>ID</th>
                        <th style={ headerStyle }>Course</th>
                        <th style={ headerStyle }>Approve</th>
                    </tr>
                </thead>
                <tbody>
                    { users.map( ( user ) => (
                        <tr key={ user.id } style={ { borderBottom: '1px solid #ddd' } }>
                            <td style={ cellStyle }>{ user.name }</td>
                            <td style={ cellStyle }>{ user.id }</td>
                            <td style={ cellStyle }>{ user.course }</td>
                            <td style={ { ...cellStyle, textAlign: 'center' } }>
                                <button
                                    onClick={ () => toggleApprove( user.id ) }
                                    style={ {
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        border: '1px solid',
                                        borderColor: user.approved ? 'green' : 'red',
                                        backgroundColor: user.approved ? '#d4edda' : '#f8d7da',
                                        color: user.approved ? 'green' : 'red',
                                        cursor: 'pointer',
                                    } }
                                >
                                    { user.approved ? 'Approved' : 'Approve' }
                                </button>
                            </td>
                        </tr>
                    ) ) }
                </tbody>
            </table>
        </div>
    );
}

const headerStyle = {
    padding: '12px',
    textAlign: 'center',
    fontWeight: '600',
    borderBottom: '2px solid #ddd'
};

const cellStyle = {
    padding: '10px',
    fontSize: '15px'
};
