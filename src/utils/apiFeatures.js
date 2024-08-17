class ApiFeatures {
  constructor(mongooseQuery, data) {
    this.mongooseQuery = mongooseQuery;
    this.data = data;
  }

  pagination() {
    let { limit, page } = this.data;
    page = page && page > 0 ? page : 1;
    limit = limit && limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;

    this.mongooseQuery.limit(limit).skip(skip);
    return this;
  }

  sort() {
    const { sort } = this.data;
    if (sort) {
      const formattedSort = sort.replace(/,/g, " ");
      this.mongooseQuery.sort(formattedSort);
    }
    return this;
  }

  fields() {
    const { fields } = this.data;
    if (fields) {
      const formattedFields = fields.replace(/,/g, " ");
      this.mongooseQuery.select(formattedFields);
    }
    return this;
  }

  search() {
    const { search } = this.data;
    if (search) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { desc: { $regex: search, $options: "i" } },
        ],
      });
    }
    return this;
  }

  populate() {
    this.mongooseQuery.populate([
      { path: "category", select: ["name", "slug"] },
      { path: "brand", select: ["name", "slug"] },
      { path: "subCategory", select: ["name", "slug"] },
    ]);
    return this;
  }
  filter() {
    let query = {...this.data};
    ["limit", "search", "page", "sort", "fields"].forEach((el) => {
      delete query[el];
    });

    if (query) {
      query = JSON.stringify(query);
      query = query.replace(/gt|gte|lt|lte|eq/g, (value) => `$${value}`);
      query = JSON.parse(query);

      this.mongooseQuery.find(query);
    }
    return this;
  }
}

export default ApiFeatures;
