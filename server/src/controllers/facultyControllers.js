import UserModel from "../models/UserModel";

// Faculty approving Evaluator/Student
export const approveUserByFaculty = async (req, res) => {
  const { userId } = req.body;
  const facultyId = req.user._id;

  const user = await UserModel.findById(userId);
  if (!user || !["Evaluator", "Student"].includes(user.role))
    return res.status(400).json({ message: "Invalid user" });

  user.isApproved = true;
  user.approvedByFaculty = facultyId;
  await user.save();

  res.status(200).json({ message: `${user.role} approved successfully` });
};
