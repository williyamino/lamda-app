import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getItem(event) {
  let item;
  const { id } = event.pathParameters;

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
    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  } else {
    throw new createError.NotFound(`Item with ID ${id} not found`);
  }
}

export const run = commonMiddleware(getItem);
