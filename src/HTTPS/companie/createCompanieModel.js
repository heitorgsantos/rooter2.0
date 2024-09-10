const { consultaCnpj, postPropertiesHS } = require("../../utils/functions");

const createCompanie = async (companie) => {
  try {
    const {
      uf,
      cep,
      bairro,
      numero,
      razao_social,
      municipio,
      cnpj,
      ddd_telefone_1,
      address,
    } = await consultaCnpj(companie.cnpj);
    if (cnpj) {
      const url = "/crm/v3/objects/companies";
      const data = {
        properties: {
          state: uf,
          cnpj: cnpj,
          city: municipio,
          cep: cep,
          numero: numero,
          bairro: bairro,
          razao_social: razao_social,
          name: razao_social,
          classificacao_da_empresa: companie.classificacao_da_empresa,
          phone: ddd_telefone_1,
          country: "Brasil",
          address: address,
        },
      };

      const responseCreateCompanie = await postPropertiesHS(url, data);
      return responseCreateCompanie.id;
    }
  } catch (error) {
    return error.message;
  }
};

module.exports = { createCompanie };
