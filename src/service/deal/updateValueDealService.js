const { searchDealAssociates } = require("../../HTTPS/deal/searchDealModel");
const { getObjects, patchPropertiesHS } = require("../../utils/functions");

const updateValueDealService = async (body) => {
  const { objectId } = body[0];

  const responseLineItemAssociatedsDeals = await searchDealAssociates(
    objectId,
    "line_items"
  );
  console.log(responseLineItemAssociatedsDeals);

  let totalValue = 0;
  for (const item of responseLineItemAssociatedsDeals.results) {
    const responseValueLineItem = await getObjects(
      `crm/v3/objects/line_items/${item.id}`
    );
    totalValue = totalValue + (Number(responseValueLineItem.properties.amount));
  }

  console.log(totalValue)
  if (totalValue > 0 && objectId) {

    const dealProperties = {
      properties: {
        amount: totalValue,
      },
    };
    await patchPropertiesHS(`crm/v3/objects/deals/${objectId}`, dealProperties);
    return "Valor do negócio atualizado com sucesso!";
  }

  return responseLineItemAssociatedsDeals;
};

module.exports = { updateValueDealService };
