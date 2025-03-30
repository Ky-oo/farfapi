const { Op } = require("sequelize");

async function handlePagination(req, model) {
  const nbDisplayed = parseInt(req.query.pagination);
  const pages = parseInt(req.query.pages) - 1 || 0;

  const quantity = await model.count();
  quantity = quantity === 0 ? 1 : quantity;

  if (!nbDisplayed || isNaN(nbDisplayed) || nbDisplayed < 1) {
    return { error: "Pagination must be a valid number greater than 0" };
  }

  if (pages < 0)
    return { error: "Pages must be a valid number greater than 0" };

  const totalPages = Math.ceil(quantity / nbDisplayed);
  if (pages >= totalPages) {
    return { error: `Page not found, max page is ${totalPages}` };
  }

  return {
    limit: nbDisplayed,
    offset: pages * nbDisplayed,
    totalPages,
  };
}

module.exports = handlePagination;
