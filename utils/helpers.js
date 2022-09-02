export const sendItemIfExist = async (item, res, next) => {
    if (item === null) {
        res.status(404).json({ 'message': 'this item doesn\'t exist' });

    } else {
        if (next) {
            try {

                const value = await next();
                if (value) {
                    item = value;
                }
            } catch (error) {
                res.status(404).json({ message: error }); console.log(error);

            }
        }
        res.status(200).json(item);


    }
};