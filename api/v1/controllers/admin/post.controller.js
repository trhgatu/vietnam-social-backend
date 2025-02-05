const controller = {

    /* [GET] api/v1/admin/posts */
    index: async (req, res) => {
        res.status(200).json({ message: "API admin đang chạy" })
    }
}
export default controller;