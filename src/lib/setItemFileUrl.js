import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function setItemFileUrl(id, fileUrl) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: { id },
    UpdateExpression: "set fileUrl = :fileUrl",
    ExpressionAttributeValues: {
      ":fileUrl": fileUrl,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
}
