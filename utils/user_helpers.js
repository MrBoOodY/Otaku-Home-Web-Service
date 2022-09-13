import User from "../models/user.js";

export const populateMyList = function (path) {
    return { path: path, select: '-_id -__v', model: 'Anime' };
}

export const sendUser = (res, list) => {
    sendUserList(res, list, true);
}

export const sendUserList = async function (res, list, sendOne) {
    await User.populate(list, [
        populateMyList('myAnimeList'),
        populateMyList('myMangaList'),
    ]);
    let serverList = [];
    list.forEach((item) => serverList.push(User(item).toClient()));
    if (serverList.length == 0) {
        res.status(404).json({ message: 'this item doesn\'t exist' });

    } else {
        if (sendOne) {
            serverList = serverList[0];
        }

        res.status(200).json(serverList);

    }
}