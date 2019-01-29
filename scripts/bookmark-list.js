/* global, store, index */
// event  handlers



//handle add boomark

//handle delete bookmark

// handle edit bookmark

// handle minimun star search




const bookmarkList = (function () {
  $.fn.extend({
    serializeJson: function () {
      const formData = new FormData(this[0]);
      const o = {
      };
      formData.forEach((val, name) => o[name] = val);
      return JSON.stringify(o);
    }
  });

  const generateNewItemSubmitFormExpanded =function(stuff){
    return `
       <label>Title</label>
          <input type="text" name="title" placeholder="Title"><br>
          <label>URL</label>
          <input type="text" name="url" placeholder="URL"><br>
          <label>Description</label>
          <input type="text" name="desc" placeholder="Description"><br>
          <label>Rating</label>
          <select>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
          </select><br>
          <button type="submit'>Add Bookmark</button>`
  }
  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  const generateItemElement =function (item){
    return `
            <li>
                  <h3>Bookmark 1</h3>
                  
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star"></span>
                  <span class="fa fa-star"></span>
              </li>`
  }
  const generateMainHtml= function(){
    return `<!-- <button>Add Bookmark</button>
    <br>
    <label>Minimum Rating</label>
    <select>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        </select>`
  }
  
  function render() {
    // Filter item list if store prop is true by item.checked === false
    let items = [ ...store.items ];
    if (store.expanded) {
      items = items.filter(item => !item.checked);
    }
  
    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = items.filter(item => item.name.includes(store.searchTerm));
    }
  
    // render the shopping list in the DOM
    console.log('`render` ran');
    const shoppingListItemsString = generateShoppingItemsString(items);
  
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  }
  function handleBookmarkSubmit() {
    $('.js-bookmark-form').submit(function (ev) {
      ev.preventDefault();
      const bookmarkitems = $(ev.target).serializeJson();
      api.createItem(bookmarkitems);
      api.getItems()
        .then(res => res.json())
        .then((items) => {
          console.log(items);
          // items.forEach((item) => {
          //   return store.addItem(item);
        });

    })


    // => '{"title":"Matrix","length":120,"studio":"WB"}'
  }

  function bindEventListeners() {
    handleBookmarkSubmit();
  }

  return { bindEventListeners: bindEventListeners }
}());