const paginate = ( page, size ) => {
  
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
    
    return {
      offset,
      limit,
    };
  };

module.exports = paginate