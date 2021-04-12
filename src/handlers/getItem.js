import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getItemById(id) {
  let item;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    item = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (item) {
    return item;
  } else {
    throw new createError.NotFound(`Item with ID ${id} not found`);
  }
}

async function getItem(event) {
  const { id } = event.pathParameters;
  const item = await getItemById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
}

export const run = commonMiddleware(getItem);
