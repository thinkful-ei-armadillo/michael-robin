/* global store, api, $ */
'use strict';
// eslint-disable-next-line no-unused-vars
const bookmarkList = (function () {
  $.fn.extend({
    serializeJson: function () {
      const formData = new FormData(this[0]);
      const o = {};
      formData.forEach((val, name) => o[name] = val);
      return JSON.stringify(o);
    }
  });

  function render() {
    let items = [...store.items];
    if (store.filter > 0)
      items = items.filter(item => item.rating >= store.filter);
    $('.js-bookmark-form').html(generateAddBookmarkForms());
    $('.js-bookmark-list').html(generateBookmarkString(items));
  }

  function generateAddBookmarkForms() {
    return `
      <div class="${store.addBookmarkExpanded ? 'hidden' : 'view'}"> 
        <div class="outsideUL">  
          <button class="js-bookmark-togglebutton">Add Bookmark</button><br>
          ${generateBookmarkRatings('bookmark-filter', 'Filter by Rating')}
        </div>
      </div>
      <div class="${store.addBookmarkExpanded ? 'view' : 'hidden'}">
        ${generateEditTextBoxes()}
      </div>`;
  }

  function generateBookmarkRatings(strId, ratingVariable) {
    return `
      <label for="${strId}">${ratingVariable}: </label>
      <select id="${strId}" name="rating">
        <option value="1" ${generateRatingOption('1')}>1 Star</option>
        <option value="2" ${generateRatingOption('2')}>2 Stars</option>
        <option value="3" ${generateRatingOption('3')}>3 Stars</option>
        <option value="4" ${generateRatingOption('4')}>4 Stars</option>
        <option value="5" ${generateRatingOption('5')}>5 stars</option>
      </select><br>`;
  }

  function generateEditTextBoxes(item) {
    return `
      <div class="outsideUL">  
        <form class="js-edit-bookmarked-item">
          <label for="bookmark-title">Title: </label>
          <input type="text" id="bookmark-title" name="title" ${!item ? '' : `value="${item.title}"`}>
          <label for="bookmark-description">Description: </label>
          <input type="text" id="bookmark-description" name="desc" ${!item ? '' : `value="${item.desc}"`}>
          <label for="bookmark-url">URL: </label>
          <input type="text" id="bookmark-url" name="url" value ="${!item ? 'https://' : item.url }">
          ${generateBookmarkRatings('bookmark-rating', 'Rating')}
          <button class="newBkmrkSubmit" type="submit" name="submit">Submit</button>
          <input type="button" name="delete-button" id="js-bookmark-delete" class="${!item ? 'hidden' : 'view'}" value="Delete">
          <input type="button" name="Cancel-editing" class="js-bookmark-togglebutton js-edit-button" value="Cancel">
        </form>
      </div>
    `;
  }

  function generatebookmarkView(item) {
    return `
        <h3>${item.title}</h3>
        <div class="${item.expanded ? 'view' : 'hidden'}">
          <p>Description: ${(!item.desc) ? '<i>none</i>' : item.desc}</p> 
          <a href="${item.url}">Visit Site</a><br>
        </div>
        <p>Rating: ${generateStarRating(item.rating)}</p>
    `;
  }
  
  function generateStarRating(rating){
    const stars = '<span class="star">&#x2605;</span>';
    return stars.repeat(rating);
  }

  function generateItemElement(item) {
    return `
        <li class="js-bookmarked-item ${ item.expanded || item.isEditing ? 'col-12': 'col-3'}" data-item-id="${item.id}"> 
          ${item.isEditing ? generateEditTextBoxes(item) : generatebookmarkView(item)}
          <div class="${!item.isEditing ? 'view' : 'hidden'} expanded-btns">
            <input type="button" name="editButton" class="js-edit-button" value="Edit">
            <input type="button" name="delete-button" id="js-bookmark-delete" value="Delete">
          </div>
        </li>
    `;
  }

  function generateRatingOption(userPick){
    return store.filter === userPick ? 'selected': ''; 
  }

  function generateBookmarkString(bookmarkedItems) {
    return bookmarkedItems
      .map((item) => generateItemElement(item))
      .join('');
  }

  function getIdFromElement(element) {
    return $(element)
      .closest('li.js-bookmarked-item')
      .data('item-id');
  }

  function handleDeleteButton() {
    $('.js-bookmark-list').on('click', '#js-bookmark-delete', function () {
      const id = getIdFromElement(this);
      api.deleteItem(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        });
    });
  }

  function handleBookmarkSubmit() {
    $('.js-bookmark-form').submit('.js-addBookmark-btn', function (ev) {
      ev.preventDefault();
      const bookmarkitems = $(this).serializeJson();
      api.createItem(bookmarkitems)
        .then(data => {
          store.addItem(data);
          render();
        });
    });
  }

  function handleBookMarkOpen() {
    $('.js-bookmark-list').on('click', 'h3', function () {
      const id = getIdFromElement(this);
      store.toggleBookmarkExpansion(id);
      render();
    });
  }

  function handleAddBookmarkToggle() {
    $('.js-bookmark-form').on('click', '.js-bookmark-togglebutton', function (ev) {
      ev.preventDefault();
      store.filter = null;
      store.toggleAddBookmark();
      render();
    });
  }

  function handleFilterResults() {
    $('.js-bookmark-form').on('change', '#bookmark-filter', function (ev) {
      const filterValue = $(ev.currentTarget).val();
      store.filter = filterValue;
      render();
    });
  }
  
  function handleEditingButton() {
    $('.js-bookmark-list').on('click', '.js-edit-button', function (ev) {
      const id = getIdFromElement(ev.target);
      store.filter = null;
      store.editItemToggle(id);
      render();
    });
  }

  function handleEditButtonSubmit(){
    $('.js-bookmark-list').submit('.js-editSubmit', function(ev){
      ev.preventDefault();
      const id = getIdFromElement(ev.target);
      const newData = $(ev.target).serializeJson();
      api.updateItem(id, newData)
        .then(() => {
          store.findAndUpdate(id,newData);
          store.editItemToggle(id);
          render();
        });
    });
  }

  function bindEventListeners() {
    handleAddBookmarkToggle();
    handleBookmarkSubmit();
    handleBookMarkOpen();
    handleDeleteButton();
    handleFilterResults();
    handleEditingButton();
    handleEditButtonSubmit();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
}());
