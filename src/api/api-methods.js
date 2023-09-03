export const baseURLauth = 'http://localhost:3003/';
export const baseURL = baseURLauth + 'api/';

// ----------------- API METHODS -----------------

export const getData = (urlToFetch, options = {}) => {
    const getDataFromUrl = async () => {
        try {
            const response =  await fetch(urlToFetch, {
                method: 'GET',
                headers: {...options.customHeaders, ...{
                    'Content-type': 'application/json',
                    'Authorization': localStorage.getItem("authToken")
                }}
            });            
            
            if(response.ok) {
                const data = await response.json();
                return data;
            } else if (response.status == 404) {
                return [];
            } else {
                const responseText = await response.text()
                return options.returnMessage ? responseText : null;
            }
        }
        catch(error) {
            throw error;
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
                headers: {...options.customHeaders, ...{
                    'Content-type': 'application/json',
                    'Authorization': localStorage.getItem("authToken")
                }}
            });

            if(response.ok) {
                const dataReturned = await response.json();
                return dataReturned;
            } else if (response.status == 404) {
                return [];
            } else {
                const responseText = await response.text()
                return options.returnMessage ? responseText : null;
            }
        }
        catch(error) {
            throw error;
        }
    };
    return postDataToEndpoint();
};

// not used in cv code but coded for demonstration

export const putData = (urlToPut, dataToPut, options = {}) => {
    const data = JSON.stringify(dataToPut);
    const putDataToEndpoint = async () => {
        try {
            const response =  await fetch(urlToPut, {
                method: 'PUT',
                body: data,
                headers: {...options.customHeaders, ...{
                    'Content-type': 'application/json',
                    'Authorization': localStorage.getItem("authToken")
                }}
            });
            if(response.ok) {
                const dataReturned = await response.json();
                return dataReturned;
            } else if (response.status == 404) {
                return [];
            } else {
                const responseText = await response.text()
                return options.returnMessage ? responseText : null;
            }
        }
        catch(error) {
            throw error;
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
                headers: {...options.customHeaders, ...{
                    'Content-type': 'application/json',
                    'Authorization': localStorage.getItem("authToken")
                }}
            });

            if(response.ok) {
                const dataReturned = await response.json();
                return dataReturned;
            } else if (response.status == 404) {
                return [];
            } else {
                const responseText = await response.text()
                return options.returnMessage ? responseText : null;
            }
        }
        catch(error) {
            throw error;
        }
    };
    return patchDataToEndpoint();
};

export const deleteData = (urlToDelete, options = {}) => {
    const deleteDataFromEndpoint = async () => {
        try {
            const response =  await fetch(urlToDelete, {
                method: 'DELETE',
                headers: {...options.customHeaders, ...{
                    'Content-type': 'application/json',
                    'Authorization': localStorage.getItem("authToken")
                }}
            });
            if(response.ok) {
                return 'Successfully deleted!'
            } else if (response.status == 404) {
                return [];
            } else {
                throw Error('No matching item found.');
            }
        }
        catch(error) {
            throw error;
        }
    }
    return deleteDataFromEndpoint();
};