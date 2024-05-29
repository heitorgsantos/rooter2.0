const existAllSugicalProcedure = (fieldHs, optionMaisPratico) => {
  return fieldHs.every(({ value }) => {
    return optionMaisPratico.every(
      ({ procedimento }) => value === procedimento
    );
  });
};

const filterSugicalProcedure = (fieldHs, optionMaisPratico) => {
  return optionMaisPratico.filter(({ procedimento }) => {
    return fieldHs.find(({ value }) => value !== procedimento);
  });
};

const dateFormat = (date) => {
  const dataDaCirurgia = date.split("-")[0].split("/");
  const horaDaCirurgia = date.split("-")[1];
  const formatedDate = `${dataDaCirurgia[2].replace(/\s/g, "")}-${
    dataDaCirurgia[1]
  }-${dataDaCirurgia[0]}`;
  const newDate = new Date(formatedDate).getTime();
  return {
    newDate,
    horaDaCirurgia,
  };
};

module.exports = {
  existAllSugicalProcedure,
  filterSugicalProcedure,
  dateFormat,
};
