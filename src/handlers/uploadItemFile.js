import { getItemById } from "./getItem";
import { uploadFileToS3 } from "../lib/uploadFileToS3";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";
import { setItemFileUrl } from "../lib/setItemFileUrl";

export async function uploadItemFile(event) {
  const { id } = event.pathParameters;
  const item = await getItemById(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  let updatedItem;
  try {
    const fileUrl = await uploadFileToS3(item.id + ".jpg", buffer);
    updatedItem = await setItemFileUrl(item.id, fileUrl);
    console.log(updatedItem);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedItem),
  };
}

export const run = middy(uploadItemFile).use(httpErrorHandler());
