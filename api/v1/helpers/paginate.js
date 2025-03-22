const paginate = async (model, query = {}, page = 1, limit = 10, populateFields = []) => {
    try {
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));

        const totalItems = await model.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;

        let dataQuery = model.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (populateFields.length > 0) {
            populateFields.forEach(field => {
                dataQuery = dataQuery.populate(field);
            });
        }

        const data = await dataQuery.exec();

        return { page, limit, totalItems, totalPages, data };
    } catch (error) {
        throw new Error("Lỗi khi phân trang: " + error.message);
    }
};

export default paginate;
