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
  console.log(date)
  const [day, month, year] = date.split("/");
  const formattedDateStr = `${year}-${month}-${day}`;
  return formattedDateStr;
};

module.exports = {
  existAllSugicalProcedure,
  filterSugicalProcedure,
  dateFormat,
};
