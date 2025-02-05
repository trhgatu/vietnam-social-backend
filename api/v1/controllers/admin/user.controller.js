const controller = {
    /* [GET] api/v1/admin/users */
    index: async (req, res) => {
        res.status(200).json({ message: "API user đang chạy" })
    }
}

export default controller;
