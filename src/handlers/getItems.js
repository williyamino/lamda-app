import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getItems(event) {
  let items;

  const params = {
    TableName: process.env.TABLE_NAME,
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    items = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
}

export const run = commonMiddleware(getItems);
