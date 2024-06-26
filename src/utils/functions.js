const { serverAxiosHS, baseApiCnpj } = require("./baseAPI");

const getPropertiesHS = async (url) => {
  try {
    const fetchProperties = await serverAxiosHS
      .get(url)
      .then((response) => response.data);
    return fetchProperties;
  } catch (error) {
    return error.message;
  }
};

const postPropertiesHS = async (url, properties) => {
  const createObject = await serverAxiosHS
    .post(url, properties)
    .then((response) => response.data)
    .catch((erro) => erro);
  return createObject;
};

const patchPropertiesHS = async (url, properties) => {
  try {
    const fetchProperties = await serverAxiosHS
      .patch(url, properties)
      .then((response) => response.data.properties);
    console.log("Atualizado com sucesso", fetchProperties);
    return fetchProperties;
  } catch (error) {
    return error.message;
  }
};

const putPropertiesHS = async (url, properties) => {
  try {
    const fetchProperties = await serverAxiosHS
      .put(url, properties)
      .then((response) => response.data.properties);
    return fetchProperties;
  } catch (error) {
    return error.message;
  }
};

const searchObject = async (url, parameters) => {
  const fetchProducts = await serverAxiosHS
    .post(url, parameters)
    .then((response) => {
      // console.log("Buscando Negócios",response.data)
      return response.data.results;
    })
    .catch((error) => {
      return { message: error.message, status: error.response.status };
    });
  return fetchProducts;
};

const getObjectsProperties = async (url) => {
  const fetchProperties = await serverAxiosHS
    .get(url)
    .then((response) => {
      return response.data.options;
    })
    .catch((error) => {
      // console.log("Error Properties: ", error.response);
      return error.response.statusText;
    });
  return fetchProperties;
};

const patchObjectsProperties = async (url, parameters) => {
  const fetchProperties = await serverAxiosHS
    .patch(url, parameters)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      // console.log(
      //   "Error ao CRIAR OPÇÕES DE PROPRIEDADES: ",
      //   error.response.data
      // );
      return error.response.statusText;
    });
  return fetchProperties;
};

const deletePropertiesHS = async (url) => {
  try {
    const responseDelete = await serverAxiosHS
      .delete(url)
      .then((response) => {
        console.log("Deletado com sucesso!");
        return response.data;
      })
      .catch((error) => error);
    return responseDelete;
  } catch (error) {
    return error.message;
  }
};

const consultaCnpj = async (cnpj) => {
  const responseDataCnpj = await baseApiCnpj
    .get(`cnpj/v1/${cnpj}`)
    .then((response) => {
      const {
        uf,
        cep,
        bairro,
        numero,
        razao_social,
        municipio,
        ddd_telefone_1,
        cnpj,
        logradouro,
      } = response.data;
      const dataCnpj = {
        uf: uf,
        address: logradouro,
        cep: cep,
        bairro: bairro,
        numero: numero,
        razao_social: razao_social,
        municipio: municipio,
        cnpj: cnpj,
        ddd_telefone_1: ddd_telefone_1,
      };
      console.log(dataCnpj);
      return dataCnpj;
    })
    .catch((error) => {
      return error.message;
    });

  return responseDataCnpj;
};

module.exports = {
  getPropertiesHS,
  postPropertiesHS,
  patchPropertiesHS,
  putPropertiesHS,
  searchObject,
  getObjectsProperties,
  patchObjectsProperties,
  consultaCnpj,
  deletePropertiesHS,
};
