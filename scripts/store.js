/* global Item */

const store = (function () {


    const addItem = function (item) {
        item.expanded = true;
        this.items.push(item);
    };

    const findAndDelete = function (id) {
        this.items = this.items.filter(item => item.id !== id);
    };

    const findAndUpdate = function (id, newData) {
        const foundItem = this.items.find(el => el.id === id);
        Object.assign(foundItem, newData);
    };

    const setItemIsEditing = function (id, isEditing) {
        const item = this.findById(id);
        item.isEditing = isEditing;
    };
    //delete bookmark

    //update or editing

    return {
        items: [],
        expandedView: false,
        addItem,
        findAndDelete,
        setItemIsEditing
    }


}());