const { Op } = require("sequelize");

async function handlePagination(req, model) {
  let nbDisplayed = parseInt(req.query.pagination);
  let pages = req.query.pages ? parseInt(req.query.pages) - 1 : 0;

  let quantity = await model.count();
  quantity = quantity === 0 ? 1 : quantity;

  if (!nbDisplayed || isNaN(nbDisplayed) || nbDisplayed < 1) {
    nbDisplayed = 10;
  }

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
