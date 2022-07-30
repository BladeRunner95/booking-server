const responseHandler = (res, fetchedData) => {
    res.append('X-Total-Count', fetchedData.length);
    res.append('Access-Control-Expose-Headers', 'X-Total-Count');

    if (Array.isArray(fetchedData)) {
        res.status(200).json(fetchedData.map(resource => ({...resource.toObject(), id: resource._id })));
    } else {
        res.status(200).json({...fetchedData.toObject(), id: fetchedData._id});
    }
};

module.exports = {
    responseHandler
}