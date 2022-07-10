const { ValidJson, SearchRegex } = require('../helper/helpers');



const MongoPaging = (data) => {
    let { PageNo, PerPage, SortBy, SrchBy } = data;
  
    SortBy = ValidJson(SortBy);
    SrchBy = ValidJson(SrchBy);
  
    console.log(SortBy);
    console.log(SrchBy);
  
    let sort = {};
    Object.entries(SortBy).forEach(([k, v]) => {
      let dir = v?.toUpperCase() === 'ASC' ? 1 : v?.toUpperCase() === 'DESC' ? -1 : '';
      sort[k] = dir;
    });
    sort = Object.keys(sort).length > 0 ? { ...sort, '_id': 1 } : {};
  
    let where = {};
    Object.entries(SrchBy).forEach(([k, v]) => {
      // where[k] = v.indexOf('%') > -1 ? new RegExp(v.replaceAll('%', ''), 'i') : v;
      // where[k] = v.indexOf('%') > -1 ? { $regex: new RegExp(v.replaceAll('%', ''), 'i') } : v;
      where[k] = { $regex: new RegExp(SearchRegex(v), 'i') };
    });
    where = Object.keys(where).length > 0 ? where : {};
  
    const limit = parseInt(PerPage ? PerPage : 3);
    const skip = PageNo ? (PageNo - 1) * limit : 0;
  
    return { limit, skip, where, sort };
  };

  const MongoFormat = (res, query) => {
    const { data, count } = res;
  
    let cnt = count[0]?.['total'] ?? 0;
  
    let ret = {
      Data: data,
      ResCount: cnt,
      PageNo: query['PageNo'],
      PerPage: query['PerPage'],
      PageCount: Math.ceil(cnt / query['PerPage']),
    };
    return ret;
  };

  module.exports = {
    MongoPaging,
    MongoFormat,
  };