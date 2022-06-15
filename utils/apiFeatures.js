class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  //Filtering product by price
  filter() {
    const queryObj = {
      // queryObj={price:300,name="Laptop",}
      ...this.queryObject,
    };
    const excludeFields = [
      "ratingAverage",
      "ratingQuantity",
      "priceDiscount",
      "category",
      "description",
      "imageCover",
      "createAt",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte | gt | lte | lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}
module.exports = APIFeatures;
