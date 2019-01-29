const api = function (){
    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/michaelRobin';
    const getItems = function () {
        return fetch(`${BASE_URL}/bookmarks`);
    };

    function listApiFetch(...args) {
        let error = false;
        return fetch(...args)
            .then(res => {
                if (!res.ok) {
                    // Valid HTTP response but non-2xx status - let's flag an error!
                    error = true;
                }

                // In either case, parse the JSON stream:
                return res.json();
            })

            .then(data => {
                // If error was flagged, throw an error with the JSON message
                if (error) throw new Error(data.message);

                // Otherwise, return the data (all promise chains 
                // return promise objects)
                return data;
            })

            .catch(err => alert(err.message));
    }

    const createItem = function (name) {
        const newItem = {
            name: name,
            url: url,
            desc: desc,
            rating: rating
        };
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(newItem),
        }
        return listApiFetch(`${BASE_URL}/items`, options);
    };


    const updateItem = function (id, updateData) {
        const options = {
            method: 'PATCH',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(updateData),
        };
        return listApiFetch(`${BASE_URL}/bookmarks/${id}`, options);
    }

    const deleteItem = function (id) {
        const options = {
            method: 'DELETE',
        };
        return listApiFetch(`${BASE_URL}/bookmarks/${id}`, options);
    };

    
    // getItems,

    // createItem,

    // updateItem,

    // deleteItem
}