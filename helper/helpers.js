const decimal2JSON = (v, i, prev) => {
    if (v !== null && typeof v === 'object') {
      if (v.constructor.name === 'Decimal128') prev[i] = v.toString();
      else Object.entries(v).forEach(([key, value]) => decimal2JSON(value, key, prev ? prev[i] : v));
    }
  };

  const ToSqlDT = (date = null) =>
  date ?? false
    ? new Date(date * 1000).toISOString().slice(0, 19).replace('T', ' ')
    : new Date(Math.floor(Date.now())).toISOString().slice(0, 19).replace('T', ' ');

const ToEpoch = (date = null) => (date ?? false ? new Date(date).getTime() / 1000 : Math.floor(Date.now() / 1000));

const ValidJson = (s) => (s == '' ? {} : JSON.parse(s.replace(/'/g, '"').replace(/\s*([\w]+)\s*(:)/g, '"$1"$2')));

const SearchRegex = (s) => {
  var rgx = [/([A-Za-z\d\s]*)%/, /%([A-Za-z\d\s]*)/, /%([A-Za-z\d\s]*)%/, /^([A-Za-z\d\s]*)$/];
  var rpc = ['^$1', '$1$', '$1', '^$1$'];
  rgx.forEach((x, i) => {
    s = s.replace(rgx[i], rpc[i]);
  });
  return s;
};

const SortAsc = (obj, key) => {
  obj.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
  return obj;
};

const SortDes = (obj, key) => {
  obj.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
  return obj;
};

  module.exports = {
    decimal2JSON,
    ToSqlDT,
    ToEpoch,
    ValidJson,
    SearchRegex,
    SortAsc,
    SortDes
}