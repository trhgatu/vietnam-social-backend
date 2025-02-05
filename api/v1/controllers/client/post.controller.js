const controller = {
    /* [GET] api/v1/posts */
    index: async (req, res) => {
        res.status(200).json({message: "API client post đang chạy"})
    }
}
export default controller;