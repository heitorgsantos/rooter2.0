const { postPropertiesHS } = require("../../utils/functions");

const createLineItem = async (data) => {
  try {
    const url = "/crm/v3/objects/line_items";
    const responseCreateLineItem = await postPropertiesHS(url, data);
    return responseCreateLineItem;
  } catch (error) {
    return { status: error.response.status, message: error.message };
  }
};

module.exports = { createLineItem };
