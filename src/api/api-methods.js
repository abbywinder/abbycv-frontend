export const baseURL = 'http://localhost:3003/api/'

// ----------------- API METHODS -----------------

export const getData = (urlToFetch, options = {}) => {
    const getDataFromUrl = async () => {
        try {
            const response =  await fetch(urlToFetch);
            if(response.ok) {
                const data = await response.json();
                return data;
            } else {
                const responseText = await response.text()
                return options.returnMessage ? responseText : null;
            }
        }
        catch(error) {
            console.log(error);
        }
    };
    return getDataFromUrl();
};

export const postData = (urlToPost, dataToPost, options = {}) => {
    const data = JSON.stringify(dataToPost);
    const postDataToEndpoint = async () => {
        try {
            const response =  await fetch(urlToPost, {
                method: 'POST',
                body: data,
                headers: options.customHeaders ? options.customHeaders : {
                    'Content-type': 'application/json'
                }
            });

            if(response.ok) {
                const dataReturned = await response.json();
                return dataReturned;
            } else {
                const responseText = await response.text()
                return options.returnMessage ? responseText : null;
            }
        }
        catch(error) {
            console.log(error);
        }
    };
    return postDataToEndpoint();
};

export const putData = (urlToPut, dataToPut, options = {}) => {
    const data = JSON.stringify(dataToPut);
    const putDataToEndpoint = async () => {
        try {
            const response =  await fetch(urlToPut, {
                method: 'PUT',
                body: data,
                headers: options.customHeaders ? options.customHeaders : {
                    'Content-type': 'application/json'
                }
            });
            if(response.ok) {
                const dataReturned = await response.json();
                return dataReturned;
            } else {
                const responseText = await response.text()
                return options.returnMessage ? responseText : null;
            }
        }
        catch(error) {
            console.log(error);
        }
    };
    return putDataToEndpoint();
};

export const patchData = (urlToPatch, op, path, value, options = {}) => {
    const patchDataToEndpoint = async () => {
        const data = JSON.stringify({
            op: op,
            path: path,
            value: value
        });
        try {
            const response =  await fetch(urlToPatch, {
                method: 'PATCH',
                body: data,
                headers: {
                    'Content-type': 'application/json'
                }
            });

            if(response.ok) {
                const dataReturned = await response.json();
                return dataReturned;
            } else {
                const responseText = await response.text()
                return options.returnMessage ? responseText : null;
            }
        }
        catch(error) {
            console.log(error);
        }
    };
    return patchDataToEndpoint();
};

export const deleteData = (urlToDelete, options = {}) => {
    const deleteDataFromEndpoint = async () => {
        try {
            const response =  await fetch(urlToDelete, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            if(response.ok) {
                return 'Successfully deleted!'
            } else {
                throw Error('No matching item found.');
            }
        }
        catch(error) {
            console.log(error);
        }
    }
    return deleteDataFromEndpoint();
};