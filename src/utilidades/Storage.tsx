import { Plugins } from "@capacitor/core";



const { Storage } = Plugins;

// JSON "set" example
export async function setObject() {
  await Storage.set({
    key: 'user',
    value: JSON.stringify({
      id: 1,
      name: 'Max'
    })
  });
}

// JSON "get" example
export async function getObject(key:string) {
  const ret = await Storage.get({ key: key });
  const user = JSON.parse(ret.value!);
}

export async function setItem(key: string, value: any) {
  await Storage.set({
    key: key,
    value: value
  });
}

export async function getItem(key: string) : Promise<any>{
  const { value } = await Storage.get({ key: key});
  return value;
}


export async function removeItem(key: string) {
  await Storage.remove({ key: key });
}

async function keys() {
  const { keys } = await Storage.keys();
  console.log('Got keys: ', keys);
}

export async function clear() {
  await Storage.clear();
}

