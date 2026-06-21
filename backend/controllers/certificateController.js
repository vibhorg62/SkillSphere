import Certificate from "../models/Certificate.js";

const getCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.userId;

        const certificate = await Certificate.findOne({ student: userId, course: courseId })
            .populate('student', 'name')
            .populate({ 
                path: 'course', 
                select: 'title instructor',
                populate: { path: 'instructor', select: 'name' } 
            });

        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found. You need to pass the course quiz first." });
        }

        return res.status(200).json({
            success: true,
            certificate
        });
    } catch (error) {
        console.error("Get Certificate Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { getCertificate };
