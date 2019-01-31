/* global, store, index */
'use strict';
const api = (function () {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/michaelRobin';
  const getItems = function () {
    return fetch(`${BASE_URL}/bookmarks`);
  };

  function listApiFetch(...args) {
    let error = false;
    return fetch(...args)
      .then(res => !res.ok ? error = true : res.json())
      .then(data => {
        if (error) throw new Error(data.message);
        return data;
      })
      .catch(err => alert(err.message));
  }

  const createItem = function (name) {
    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: name,
    };
    return listApiFetch(`${BASE_URL}/bookmarks`, options);
  };

  const updateItem = function (id, updateData) {
    const options = {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: updateData,
    };
    return listApiFetch(`${BASE_URL}/bookmarks/${id}`, options);
  };

  const deleteItem = function (id) {
    const options = {
      method: 'DELETE',
    };
    return listApiFetch(`${BASE_URL}/bookmarks/${id}`, options);
  };

  return {
    getItems,
    createItem,
    updateItem,
    deleteItem
  };
}());