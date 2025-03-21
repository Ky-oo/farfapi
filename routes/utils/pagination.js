const { Op } = require("sequelize");

async function handlePagination(req, model) {
  const nbDisplayed = req.query.pagination;
  const pages = parseInt(req.query.pages) - 1 || 0;

  const quantity = await model.count();

  if (quantity == 0) {
    return { error: "Collection is empty" };
  }

  if (nbDisplayed) {
    if (isNaN(nbDisplayed)) {
      return { error: "Pagination must be a number" };
    }

    if (parseInt(nbDisplayed) < 1) {
      return { error: "Pagination not valid" };
    }

    if (parseInt(pages) < 0) {
      return { error: "Pages not valid" };
    }

    const totalPages = Math.ceil(quantity / parseInt(nbDisplayed));

    if (pages >= totalPages) {
      return { error: `Page not found, max page is ${totalPages}` };
    }

    return {
      limit: parseInt(nbDisplayed),
      offset: pages * parseInt(nbDisplayed),
      totalPages,
    };
  }

  return { limit: null, offset: null, totalPages: null };
}

module.exports = handlePagination;
