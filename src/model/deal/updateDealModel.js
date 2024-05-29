const { patchObjectsProperties } = require("../../utils/functions");

const updateDeal = async (id, data) => {
  const url = `/crm/v3/objects/deals/${id}`;
  try {
    const responseUpdateDeal = await patchObjectsProperties(url, data);
    return responseUpdateDeal;
  } catch (error) {
    return { status: error.response.status, message: error.message };
  }
};

module.exports = { updateDeal };
