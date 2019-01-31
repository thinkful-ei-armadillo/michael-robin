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

  const generateForms = function () {
    return `
      <div class="${store.addBookmarkExpanded ? 'hidden' : 'view'}"> 
      <button class="js-addbookmark-togglebutton">Add Bookmark</button><br>
        ${generateBookmarkRatings('bookmark-filter')}
      </div>
      <div class="${store.addBookmarkExpanded ? 'view' : 'hidden'}">
        ${generateEditTextBoxes()}
      </div>`;
      //  <label for="bookmark-title">Title</label>
      //     <input type="text" id="bookmark-title" name="title" placeholder="Title"><br>
      //     <label for="bookmark-url">URL</label>
      //     <input type="text" id="bookmark-url" name="url" value="https://"><br>
      //     <label for="bookmark-description">Description</label>
      //     <input type="text" id="bookmark-description" name="desc" placeholder="Description"><br>
      //     <label for="bookmark-rating">Rating</label>
      //     <select id="bookmark-rating" name="rating">
      //         <option value="1">1 Star</option>
      //         <option value="2">2 Star</option>
      //         <option value="3">3 Star</option>
      //         <option value="4">4 Star</option>
      //         <option value="5">5 star</option>
      //     </select><br>
      //     <input type="submit" name="submitBookmark" class ="js-addBookmark-btn" value="Add Bookmark">
      //     <input type="button" name="Cancel-editing" class="js-addbookmark-togglebutton" value="Cancel">
      //   </div>`;
  };

  const generateBookmarkRatings= function(strId){
    return `
      <label for="${strId}">Rating: </label>
      <select id="${strId}" name="rating">
        <option value="1">1 Star</option>
        <option value="2">2 Star</option>
        <option value="3">3 Star</option>
        <option value="4">4 Star</option>
        <option value="5">5 star</option>
      </select><br>`;
  };

  const generateEditTextBoxes = function (item) {
    return `
    <form class="js-edit-bookmarked-item">
      <label for="bookmark-title">Title: </label>
      <input type="text" id="bookmark-title" name="title" ${!item ? '' : `value="${item.title}"`}><br>
      <label for="bookmark-description">Description: </label>
      <input type="text" id="bookmark-description" name="desc" ${!item ? '' : `value="${item.desc}"`}><br>
      <label for="bookmark-url">URL: </label>
      <input type="text" id="bookmark-url" name="url" ${!item ? '' : `value="${item.url}"`}><br>
      ${generateBookmarkRatings('bookmark-rating')}
      <button type="submit" class="js-editSubmit"> submit</button>
    </form>
    `;
  };

  const generatebookmarkView = function (item) {
    return `
          <h3>${item.title}</h3>
          <div class="${item.expanded ? 'view' : 'hidden'}">
            <p>description: ${(!item.desc) ? 'no description avaiable' : item.desc}</p> 
            <a href="${item.url}">Visit Site</a><br>
          </div>
          <p>Rating: ${item.rating}</p>
    `;
  };

  const generateItemElement = function (item) {
    return `
        <li class="js-bookmarked-item ${ item.expanded ? 'col-12': 'col-3'}" data-item-id="${item.id}"> 
          ${item.isEditing ? generateEditTextBoxes(item) : generatebookmarkView(item)}
          <button type="submit" class="${item.expanded ? 'view' : 'hidden'} js-edit-button">Edit</button>
          <button name="delete-button" id="js-bookmark-delete">Delete</button>
        </li>
    `;
  };

  const generateBookmarkString = function (bookmarkedItems) {
    return bookmarkedItems
      .map((item) => generateItemElement(item))
      .join('');
  };

  const getIdFromElement = function (el){
    return $(el)
      .closest('li.js-bookmarked-item')
      .data('item-id');
  };

 
  function render() {
    let items = [...store.items];
    
    if (store.filter > 0)
      items = items.filter(item => item.rating >= store.filter);

    $('.js-bookmark-form').html(generateForms());
    $('.js-bookmark-list').html(generateBookmarkString(items));
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
    $('.js-bookmark-form').on('click', '.js-addbookmark-togglebutton', function (ev) {
      ev.preventDefault();
      store.toggleAddBookmark();
      render();
    });
  }

  function bookmarkFilterResults() {
    $('.js-bookmark-form').on('change', '#bookmark-filter', function (ev) {
      const filterValue = $(ev.currentTarget).val();
      store.filter = filterValue;
      render();
    });
  }
  
  function handleEditingButton() {
    $('.js-bookmark-list').on('click', '.js-edit-button', function (ev) {
      const id = getIdFromElement(ev.target);
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
    bookmarkFilterResults();
    handleEditingButton();
    handleEditButtonSubmit();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
}());