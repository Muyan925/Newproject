import Dexie from "dexie"; 
import { useLiveQuery } from "dexie-react-hooks"; 

export const db = new Dexie("todo-photos"); 
db.version(1).stores({ 
  photos: "id", 
});

export async function addPhoto(id, imgSrc) { 
  console.log("addPhoto", imgSrc.length, id);
  try {
    const i = await db.photos.add({
      id: id, 
      imgSrc: imgSrc,
    });
    console.log(`Photo ${imgSrc.length} bytes successfully added. Got id ${i}`);
  } catch (error) {
    console.log(`Failed to add photo: ${error}`);
  }
  return (
    <>
      <p>
        {imgSrc.length} &nbsp; | &nbsp; {id}
      </p>
    </>
  );
}

export function GetPhotoSrc(id) {
  console.log("getPhotoSrc", id);
  const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());
  console.table(img);
  if (Array.isArray(img) && img.length > 0) {
    return img[0].imgSrc;
  } else {
    return null; // 返回 null 或其他默认值，表示未找到图片
  }
}

export async function deletePhoto(id) {
  console.log("deletePhoto", id);
  try {
    await db.photos.where("id").equals(id).delete();
    console.log(`Photo with id ${id} successfully deleted.`);
  } catch (error) {
    console.log(`Failed to delete photo with id ${id}: ${error}`);
  }
}
