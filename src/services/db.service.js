class DatabaseService {
    constructor(model) {
        this.model = model;
    }

    // Create a new document
    async create(data) {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            throw error;
        }
    }

    // Find one document by query
    async findOne(query, projection = {}) {
        try {
            return await this.model.findOne(query, projection).exec();
        } catch (error) {
            throw error;
        }
    }

    // Find many documents by query
    async find(query = {}, projection = {}) {
        try {
            return await this.model.find(query, projection).exec();
        } catch (error) {
            throw error;
        }
    }

    // Update one document
    async updateOne(query, update, options = { new: true }) {
        try {
            return await this.model
                .findOneAndUpdate(query, update, options)
                .exec();
        } catch (error) {
            throw error;
        }
    }

    // Delete one document
    async deleteOne(query) {
        try {
            return await this.model.findOneAndDelete(query).exec();
        } catch (error) {
            throw error;
        }
    }

    // Aggregate pipeline
    async aggregate(pipeline) {
        try {
            return await this.model.aggregate(pipeline).exec();
        } catch (error) {
            throw error;
        }
    }

    // Count documents
    async count(query = {}) {
        try {
            return await this.model.countDocuments(query).exec();
        } catch (error) {
            throw error;
        }
    }

    // Find with pagination
    async findPaginated(
        query = {},
        options = { page: 1, limit: 10, sort: {} }
    ) {
        try {
            const { page, limit, sort } = options;
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                this.model
                    .find(query)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.model.countDocuments(query),
            ]);

            return {
                data,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DatabaseService;
