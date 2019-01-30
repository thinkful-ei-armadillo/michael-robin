/* global Item */

const store = (function () {

    const addItem = function (item) {
        item.expanded = false;
        item.isEditing = false;
        this.items.push(item);
    };

    const findAndDelete = function (id) {
        this.items = this.items.filter(item => item.id !== id);
    };

    const findAndUpdate = function (id, newData) {
        const foundItem = this.items.find(el => el.id === id);
        Object.assign(foundItem, newData);
    };
    const findById = function(id) {
        return this.items.find(item => item.id === id);
      };
    const toggleBookmark = function (id){
       const bookmarkItem = store.findById(id);
       bookmarkItem.expanded = !bookmarkItem.expanded;
    }

    const setItemIsEditing = function (id, isEditing) {
        const item = this.findById(id);
        item.isEditing = isEditing;
    };

    return {
        items: [],
        expanded: false,
        filter: null,

        addItem,
        findAndDelete,
        setItemIsEditing,
        toggleBookmark,
        findById
    }


}());