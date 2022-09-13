
import Manga from "../models/manga.js";
import { populateCategory, populateStatus } from "./helpers.js";


export const sendManga = (res, list) => {
    sendMangaList(res, list, true);
}

export const sendMangaList = async function (res, list, sendOne) {
    await Manga.populate(list, [
        populateStatus,
        populateCategory,
    ]);
    let serverList = [];
    list.forEach((item) => serverList.push(Manga(item).toClient(item.rates, item.status, item.addedListManga)));
    if (serverList.length == 0) {
        res.status(404).json({ message: 'this item doesn\'t exist' });

    } else {
        if (sendOne) {
            serverList = serverList[0];
        }

        res.status(200).json(serverList);

    }
}