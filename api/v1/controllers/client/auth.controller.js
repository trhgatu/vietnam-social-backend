import { loginService } from "../../services/auth/auth-service.js";

const controller = {
    /* [POST] api/v1/auth/login */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await loginService(email, password);
            return res.status(result.status).json(result);
        } catch(error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server error"
            })
        }
    }
}
export default controller;