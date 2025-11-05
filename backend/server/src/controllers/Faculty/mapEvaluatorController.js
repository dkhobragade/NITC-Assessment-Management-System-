import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";

// File upload configuration
const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) cb(null, true);
    else cb(new Error("Only Excel files are allowed"), false);
  },
});

// Parse Excel function
const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return data;
};

// Upload endpoint
export const uploadExcelFiles = async (req, res) => {
  try {
    if (!req.files || !req.files.evaluator || !req.files.student)
      return res.status(400).json({ message: "Both evaluator and student Excel files are required" });

    const evaluatorData = parseExcel(req.files.evaluator[0].path);
    const studentData = parseExcel(req.files.student[0].path);

    res.status(200).json({
      message: "Files uploaded successfully",
      evaluators: evaluatorData,
      students: studentData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing Excel files" });
  }
};

// Random mapping
export const randomMapping = (req, res) => {
  try {
    const { evaluators, students } = req.body;

    if (!evaluators || !students) {
      return res.status(400).json({ message: "Evaluator and student data required" });
    }

    const mapping = students.map((student, index) => {
      const evaluator = evaluators[index % evaluators.length];
      return { student, evaluator };
    });

    res.status(200).json({ message: "Random mapping successful", mapping });
  } catch (error) {
    res.status(500).json({ message: "Error in random mapping" });
  }
};
