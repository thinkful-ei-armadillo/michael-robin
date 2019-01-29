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
      const o = {};
      formData.forEach((val, name) => o[name] = val);
      return JSON.stringify(o);
    }
  });

  const generateNewItemSubmitFormExpanded = function (){
    return `
       <label>Title</label>
          <input type="text" name="title" placeholder="Title"><br>
          <label>URL</label>
          <input type="text" name="url" placeholder="URL"><br>
          <label>Description</label>
          <input type="text" name="desc" placeholder="Description"><br>
          <label>Rating</label>
          <select name="rating">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
          </select><br>
          <button type="submit" class="js-addBookmark-btn">Add Bookmark</button>`;
  }

  function generateBookmarkString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  const generateItemElement =function (item){
    return `
            <li class="ex-view"> 
                  <h3>${item.title}</h3>
                  ${generateExpandedView(item)}
                  <p>${item.rating}</p>
              </li>`
  }

  function generateExpandedView(item){
    return item.expanded ?
    `<p>description: ${(!item.desc) ? 'no description avaiable': item.desc}</p>
    <a href="${item.url}">Visit Site</a>` : '';
  }
  
  function render() {
    // Filter item list if store prop is true by item.checked === false
    let items = [ ...store.items ];
    if (store.expandedView) {
      items = items.filter(item => !item.expanded);
    }
    // // Filter item list if store prop `searchTerm` is not empty
    // if (store.searchTerm) {
    //   items = items.filter(item => item.name.includes(store.searchTerm));
    // }
  
    // render the shopping list in the DOM
    console.log('`render` ran');
    // const shoppingListItemsString = generateShoppingItemsString(items);
  
    // insert that HTML into the DOM
    $('.js-bookmark-list').html(generateBookmarkString(items));
  }

  function handleBookmarkSubmit() {
    $('.js-bookmark-form').submit('.js-addBookmark-btn', function (ev) {
      ev.preventDefault();
      const bookmarkitems = $(ev.target).serializeJson();
      console.log(bookmarkitems);
      api.createItem(bookmarkitems)
      .then(data => {
        store.addItem(data);
        render();
      });
          // items.forEach((item) =>    //   return store.addItem(item);
    });
    // => '{"title":"Matrix","length":120,"studio":"WB"}'
  }

  function handleAddBookMark(){
    $('.js-addbookmark-button').on('click', function(ev){
      ev.preventDefault();
      $('.js-bookmark-form').html(generateNewItemSubmitFormExpanded());
    })
  }

  function bindEventListeners() {
    // handleBookmarkSubmit();
    handleAddBookMark();
    handleBookmarkSubmit();
  }

  return { render: render,
    bindEventListeners: bindEventListeners }
}());