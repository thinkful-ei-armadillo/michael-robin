// event  handlers



//handle add boomark

//handle delete bookmark

// handle edit bookmark

// handle minimun star search
const bookmarkList = (function (){
$.fn.extend({
    serializeJson: function() {
      const formData = new FormData(this[0]);
      const o = {};
      formData.forEach((val, name) => o[name] = val);
      return JSON.stringify(o);
    }
  });

  function handleBookmarkSubmit() {
    $('.js-bookmark-form').submit(function(ev){
        ev.preventDefault();
        const bookmarkitems = $(ev.target).serializeJson();  
        console.log(Item.validateTitleAndUrl(bookmarkitems));

    })
       

    // => '{"title":"Matrix","length":120,"studio":"WB"}'
  }

  function  bindEventListeners() {
    handleBookmarkSubmit();
  }
 
  return {bindEventListeners: bindEventListeners}
}());