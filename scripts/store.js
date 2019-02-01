/* global  */
'use strict';
const store = (function () {
  const addItem = function (item) {
    const newItem = Object
      .assign(item, { expanded: false, isEditing: false });
    this.items.push(newItem);
  };

  const findAndDelete = function (id) {
    this.items = this.items.filter(item => item.id !== id);
  };

  const findAndUpdate = function (id, newData) {
    Object.assign(findById(id), JSON.parse(newData));
  };

  const findById = function (id) {
    return store.items.find(item => item.id === id);
  };

  const toggleBookmarkExpansion = function (id) {
    const bookmarkItem = store.findById(id);
    bookmarkItem.expanded = !bookmarkItem.expanded;
  };

  const editItemToggle = function (id) {
    const item = this.findById(id);
    item.isEditing = !item.isEditing;
  };

  const toggleAddBookmark = function (){
    this.addBookmarkExpanded = !this.addBookmarkExpanded;
  };

  return {
    items: [],
    addBookmarkExpanded: false,
    filter: null,

    addItem,
    findAndDelete,
    findAndUpdate,
    findById,
    toggleBookmarkExpansion,
    editItemToggle,
    toggleAddBookmark
  };
}());