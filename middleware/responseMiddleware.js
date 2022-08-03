const responseHandler = (res, fetchedData, secure = false) => {
    res.append('X-Total-Count', fetchedData.length);
    res.append('Access-Control-Expose-Headers', 'X-Total-Count');

    if (Array.isArray(fetchedData)) {
        res.status(200).json(fetchedData.map(resource => {
            //can I check instance of resource object to check if it's plain object or mongoose document
            //
                if (secure) {
                    let {password, ...rest} = resource._doc;
                    return {...rest, id: resource._id}
                } else {
                    return {...resource.toObject(), id: resource._id}
                }
            }
        ));
    } else {
        res.status(200).json({...fetchedData.toObject(), id: fetchedData._id});
    }
};

module.exports = {
    responseHandler
}