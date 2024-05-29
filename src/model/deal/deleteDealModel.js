const { deletePropertiesHS } = require("../../utils/functions");

const deleteDeal = async (id) => {
  try {
    const url = `/crm/v3/objects/deals/${id}`;
    const responseDeleteDeal = await deletePropertiesHS(url);
    return responseDeleteDeal;
  } catch (error) {
    return { status: error.resonse.status, message: error.message };
  }
};

module.exports = { deleteDeal };
