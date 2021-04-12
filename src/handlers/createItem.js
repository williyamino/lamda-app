import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

async function createItem(event) {
  const data = event.body;
  const dateNow = new Date();

  const item = {
    id: uuidv4(),
    text: data.text,
    checked: false,
    createdAt: dateNow.toISOString(),
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: item,
  };

  try {
    await dynamoDB.put(params).promise();
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: `Your item ${item.text} has been created`,
          recipient: process.env.MAIL_RECIPIENT,
          body: "You successfull created item",
        }),
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
}

export const run = commonMiddleware(createItem);
