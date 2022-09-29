export default (view) => {
    const onAction = async ({type, ...params}) =>  {
        switch(type) {
            case `add-data`:
                const dataPostUrl = params.wrapper.buildUrl(params.dataEndpoint, params.place);
                params.wrapper.postData(dataPostUrl, params.values)
                .then(() => {
                    view.displayMessage(`Successfully added data!`);
                })
                .catch(() => {
                    view.displayMessage(`Adding data failed!`);
                });
                break;
        }
    }

    return { onAction }
}