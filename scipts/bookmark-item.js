//create each bookmark
const Item = (function () {

    const validateTitleAndUrl = function (title, url) {
      if (!name || !url && url.length < 5) throw new TypeError('Name/url must not be blank');
    };
  
    const create = function (title, url, rating, desc) {
      return {
        id: cuid(),
        title,
        desc,
        url,
        rating
      };
    };
  
    return {
      validateTitleAndUrl,
      create,
    };
  
  }());