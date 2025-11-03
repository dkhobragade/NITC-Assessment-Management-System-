import AdminUser from "../../models/AdminUser.js";
import FacultyUser from "../../models/FacultyUser.js";
import bcryptjs from 'bcryptjs'
import { generateToken } from "../../utils/utils.js";


export const adminSignup = async ( req, res ) =>
{
  const { fullName, email, id, password } = req.body;

  try
  {
    if ( password.length < 6 )
    {
      return res
        .status( 400 )
        .json( { message: "Password must be atleast 6 character" } );
    }

    const user = await AdminUser.findOne( { email } );

    if ( user ) return res.status( 400 ).json( { message: "Email already exits" } );

    const salt = await bcryptjs.genSalt( 10 );

    const hashedPassword = await bcryptjs.hash( password, salt );

    const newUser = new AdminUser( {
      fullName,
      email,
      id,
      password: hashedPassword,
      role: "Admin",
    } );

    if ( newUser )
    {
      generateToken( { userId: newUser._id, res } );
      await newUser.save();

      res.status( 201 ).json( {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        id:newUser.id,
        message: "Admin added Succesfully",
        role: newUser.role,
      } );

      return;
    } else
    {
      res.status( 400 ).json( { message: "Invalid User Data" } );
    }
  } catch ( error )
  {
    console.log( "Error in SignUp controller", error.message );
    res.status( 500 ).json( { message: "Internal Server Error" } );
  }


}

export const approveFaculty = async (req, res) => {
  const { facultyId } = req.body;

  try {
    const faculty = await FacultyUser.findById(facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    faculty.approved = true;
    await faculty.save();

    res.status(200).json({ message: "Faculty approved successfully" });
  } catch (error) {
    console.error("Error approving faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const adminLogin = async ( req, res ) => { }
export const adminLogout = async ( req, res ) => { }