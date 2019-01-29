/* global bookmark-list, store,api,$ */
$(document).ready(function () {
  api.getItems()
   .then ( res  => res.json())
   .then (resJ => 
    resJ.forEach(item => {
      store.addItem(item);
      bookmarkList.bindEventListeners();
      bookmarkList.render();
    }))
    
});
  
  