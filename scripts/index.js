/* global store,api,bookmarkList, $ */
'use strict';
$(document).ready(function () {
  api.getItems()
    .then(res => res.json())
    .then(resJ => {
      resJ.forEach(item =>
        store.addItem(item));
      bookmarkList.bindEventListeners();
      bookmarkList.render();
    });
});

