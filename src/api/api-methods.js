export const baseURL = 'http://localhost:3003/api/'

// ----------------- API METHODS -----------------

export const getData = urlToFetch => {
    const getDataFromUrl = async () => {
        try {
            const response =  await fetch(urlToFetch);
            if(response.ok) {
                const data = await response.json();
                return data;
            } else {
                return null;
            }
        }
        catch(error) {
            console.log(error);
        }
    };
    return getDataFromUrl();
};

export const postData = (urlToPost, dataToPost, customHeaders) => {
    const data = JSON.stringify(dataToPost);
    const postDataToEndpoint = async () => {
        try {
            const response =  await fetch(urlToPost, {
                method: 'POST',
                body: data,
                headers: customHeaders ? customHeaders : {
                    'Content-type': 'application/json'
                }
            });

            if(response.ok) {
                const dataReturned = await response.json();
                return dataReturned;
            } else {
                return null;
            }
        }
        catch(error) {
            console.log(error);
        }
    };
    return postDataToEndpoint();
};

export const putData = (urlToPut, dataToPut, customHeaders) => {
    const data = JSON.stringify(dataToPut);
    const putDataToEndpoint = async () => {
        try {
            const response =  await fetch(urlToPut, {
                method: 'PUT',
                body: data,
                headers: customHeaders ? customHeaders : {
                    'Content-type': 'application/json'
                }
            });
            if(response.ok) {
                const dataReturned = await response.json();
                return dataReturned;
            } else {
                return null;
            }
        }
        catch(error) {
            console.log(error);
        }
    };
    return putDataToEndpoint();
};

export const patchData = (urlToPatch, op, path, value) => {
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
                return null;
            }
        }
        catch(error) {
            console.log(error);
        }
    };
    return patchDataToEndpoint();
};

export const deleteData = (urlToDelete) => {
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