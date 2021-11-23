import { Storage, Drivers } from "@ionic/storage";

var storage: Storage ;

export const createStore = (name:string) => {

    storage = new Storage({
        
        name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });

    storage.create();
}


export const setDB = (key: string, val: any) => {

    storage.set(key, val);
}

export const getDB = async (key: string) => {

    const val = await storage.get(key);
    return val;
}

export const removeDB = async (key: string) => {

    await storage.remove(key);
}

export const clearDB = async () => {

    await storage.clear();
}
/*
export const setObject = async (key: string, id: string, val: any) => {

    const all = await storage.get(key);
    const objIndex = await all.findIndex((a: { id: string; }) => {parseInt(a.id) === parseInt(id)});

    all[objIndex] = val;
    set(key, all);
}

export const removeObject = async (key: string, id: string) => {

    const all = await storage.get(key);
    const objIndex = await all.findIndex((a: { id: string; }) => parseInt(a.id) === parseInt(id));

    all.splice(objIndex, 1);
    set(key, all);
}

export const getObject = async (key: string, id: string) => {

    const all = await storage.get(key);
    const obj = await all.filter((a: { id: string; }) => parseInt(a.id) === parseInt(id))[0];
    return obj;
}*/
