import { createUserService } from "../../services/admin/user-service.js";

const controller = {
    /* [GET] api/v1/admin/users */
    index: async (req, res) => {
        res.status(200).json({ message: "API user đang chạy" })
    },

    createUser: async (req, res) => {
        const { name, email, password } = req.body;
        const result = await createUserService(name, email, password);
        return res.status(result.statusCode).json(result);
    }
}

export default controller;
