var AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});
const tableName = "Cards";
exports.handler = async (event) => {
    console.log("Received: " + JSON.stringify(event, null, 2));
    let response = '';
    try{
        var params = {
            TableName : tableName
            // FilterExpression : 'Year = :this_year',
            // ExpressionAttributeValues : {':this_year' : 2015}
        };
        const cards = await documentClient.scan(params).promise();

        response = {
            statusCode: 200,
            // CORS로 인해 미등록시 에러가 남
            // AWS APIgateway에 CORS를 등록함
            // 람다 프록시통합을 사용했을 경우 람다 함수에 아래와 같이 response에 headers를 넣어주어야 함 
            headers: {
                // "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                // "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(cards),
        };
    } catch (exception) {
        console.error(exception);
        response = {
            statusCode: 500,
            headers: {
                // "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                // "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({"Message: ": exception}),
        };
    }
    return response;
};
