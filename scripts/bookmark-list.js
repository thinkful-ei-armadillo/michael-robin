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
        <button class="js-bookmark-togglebutton">Add Bookmark</button><br>
        ${generateBookmarkRatings('bookmark-filter', 'Minimun Rating')}
      </div>
      <div class="${store.addBookmarkExpanded ? 'view' : 'hidden'}">
        ${generateEditTextBoxes()}
      </div>`;
  }

  function generateBookmarkRatings(strId, ratingVariable) {
    return `
      <label for="${strId}">${ratingVariable}: </label>
      <select id="${strId}" name="rating">
        <option value="0"${generateRatingOption(null)}>None</option>
        <option value="1" ${generateRatingOption('1')}>1 Star</option>
        <option value="2" ${generateRatingOption('2')}>2 Star</option>
        <option value="3" ${generateRatingOption('3')}>3 Star</option>
        <option value="4" ${generateRatingOption('4')}>4 Star</option>
        <option value="5" ${generateRatingOption('5')}>5 star</option>
      </select><br>`;
  }

  function generateEditTextBoxes(item) {
    return `
      <form class="js-edit-bookmarked-item">
        <label for="bookmark-title">Title: </label>
        <input type="text" id="bookmark-title" name="title" ${!item ? '' : `value="${item.title}"`}><br>
        <label for="bookmark-description">Description: </label>
        <input type="text" id="bookmark-description" name="desc" ${!item ? '' : `value="${item.desc}"`}><br>
        <label for="bookmark-url">URL: </label>
        <input type="text" id="bookmark-url" name="url" value ="${!item ? 'https://' : item.url }"><br>
        ${generateBookmarkRatings('bookmark-rating', 'Choose Your Rating')}
        <button type="submit" name="submit"> submit </button>
        <input type="button" name="Cancel-editing" class="js-bookmark-togglebutton js-edit-button" value="Cancel">
      </form>
    `;
  }

  function generatebookmarkView(item) {
    return `
        <h3>${item.title}</h3>
        <div class="${item.expanded ? 'view' : 'hidden'}">
          <p>description: ${(!item.desc) ? 'no description avaiable' : item.desc}</p> 
          <a href="${item.url}">Visit Site</a><br>
        </div>
        <p>Rating: ${item.rating}</p>
    `;
  }

  function generateItemElement(item) {
    return `
        <li class="js-bookmarked-item ${ item.expanded || item.isEditing ? 'col-12': 'col-3'}" data-item-id="${item.id}"> 
          ${item.isEditing ? generateEditTextBoxes(item) : generatebookmarkView(item)}
          <input type="button" name="editButton" class="${!item.isEditing ? 'view' : 'hidden'} js-edit-button" value="Edit">
          <input type="button" name="delete-button" id="js-bookmark-delete" value="Delete">
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