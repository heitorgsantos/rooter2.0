const { searchObject } = require("../../utils/functions");
const { queryLineItems } = require("../../utils/querys");

const searchLineItems = async (lineItems) => {
  try {
    const url = "/crm/v3/objects/line_items/search";

    const [responseLineItems] = await searchObject(
      url,
      queryLineItems(lineItems)
    );

    return responseLineItems.length > 0 ? responseLineItems : false;
  } catch (error) {
    return error.message;
  }
};
module.exports = { searchLineItems };
