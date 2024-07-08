const queryProducts = (products) => {
  const skuValues = [];
  products.forEach(({ sku_mais_pratico }) => skuValues.push(sku_mais_pratico));
  const query = {
    properties: [
      "hs_object_id",
      "name",
      "price",
      "quantity",
      "sku_mais_pratico",
      "hs_sku"
    ],
    filterGroups: [
      {
        filters: [
          {
            propertyName: "hs_sku",
            values: skuValues,
            operator: "IN",
          },
        ],
      },
    ],
  };
  return query;
};

const queryLineItems = (products) => {
  const idValues = [];
  products.forEach(({ id }) => idValues.push(id));
  const query = {
    properties: [
      "hs_object_id",
      "name",
      "price",
      "quantity",
      "hs_product_id",
      "sku_mais_pratico",
    ],
    filterGroups: [
      {
        filters: [
          {
            propertyName: "hs_sku",
            values: idValues,
            operator: "IN",
          },
        ],
      },
    ],
  };
  return query;
};

const queryDoctor = (doctor) => {
  const query = {
    properties: ["hs_object_id"],
    filterGroups: [
      {
        filters: [
          {
            propertyName: "crm_",
            value: doctor.crm,
            operator: "EQ",
          },
        ],
      },
    ],
  };
  return query;
};

const queryCompany = (company) => {
  const query = {
    properties: ["hs_object_id"],
    filterGroups: [
      {
        filters: [
          {
            propertyName: "cnpj",
            value: company.cnpj,
            operator: "EQ",
          },
        ],
      },
    ],
  };
  return query;
};

const queryDeal = (deal) => {
  const { id_da_cotacao } = deal;
  const query = {
    properties: [
      "id_da_cotacao",
      "dealname",
      "paciente",
      "instrumentador",
      "pipeline",
    ],
    filters: [
      {
        propertyName: "id_da_cotacao",
        value: id_da_cotacao,
        operator: "EQ",
      },
    ],
  };
  return query;
};

const queryDealStage = (dealstage) => {
  const query = {
    properties: [
      "id_da_cotacao",
      "dealname",
      "paciente",
      "instrumentador",
      "pipeline",
    ],
    filters: [
      {
        propertyName: "dealstage",
        value: dealstage,
        operator: "EQ",
      },
    ],
  };
  return query;
};

const queryDealId = (id_da_cotacao) => {
  const query = {
    properties: [
      "id_da_cotacao",
      "dealname",
      "paciente",
      "instrumentador",
      "pipeline",
    ],
    filters: [
      {
        propertyName: "id_da_cotacao",
        value: id_da_cotacao,
        operator: "EQ",
      },
    ],
  };
  return query;
};

const queryUpdateProduct = (sku_mais_pratico) => {
  const query = {
    properties: ["hs_object_id"],
    filterGroups: [
      {
        filters: [
          {
            propertyName: "sku_mais_pratico",
            value: sku_mais_pratico,
            operator: "EQ",
          },
        ],
      },
    ],
  };
  return query;
};

module.exports = {
  queryProducts,
  queryDoctor,
  queryCompany,
  queryDeal,
  queryUpdateProduct,
  queryLineItems,
  queryDealStage,
  queryDealId
};
