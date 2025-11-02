export const signup=async(req,res)=>{
      const { fullName, email, id, password } = req.body;

      try {

      } catch (error) {
        console.log("Error in SignUp controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
      }


}
export const login=async(req,res)=>{}
export const logout=async(req,res)=>{}