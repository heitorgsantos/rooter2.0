const { patchObjectsProperties } = require("../../utils/functions");

const updateLineItem = async (id,data) => {
  try {
    const url = `/crm/v3/objects/line_items/${id}`;
    const responseUpdateLineItems = await patchObjectsProperties(url, data);
    return responseUpdateLineItems;
  } catch (error) {
    return { status: error.response.status, message: error.message };
  }
};

module.exports = { updateLineItem };
