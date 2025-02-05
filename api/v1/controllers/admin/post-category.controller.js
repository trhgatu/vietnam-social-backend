const controller = {
    index: async (req, res) => {
        res.status(200).json({ message: "API category đang chạy" })
    }
}
export default controller;