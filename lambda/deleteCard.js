var AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});
const tableName = "Cards";
exports.handler = async (event) => {
    console.log("Received: " + JSON.stringify(event, null, 2));
    let response = '';
    try{
        const id = event.pathParameters.id;
        var params = {
            TableName : tableName,
            Key: {
              "id": id,
            }
          };
        await documentClient.delete(params).promise();
        
        response = {
            statusCode: 200
        };
    } catch (exception) {
        console.error(exception);
        response = {
            statusCode: 500,
            body: JSON.stringify({"Message: ": exception}),
        };
    }
    return response;
};

// API Gateway 배포하기
// Rate : 10,000 - 0~1초에 총 처리할 수 있는 api 요청 건수
// Burst : 5,000 - 정확히 같은 한 시점에 처리할 수 있는 api 요청 건수
// Lambda함수 -> 동시성 : Lambda 함수가 요청에 의해 실행중인 상태에서 다른 요청이 들어오게 되면 AWS내에서 두번째 컨테이너와 런타임을 띄우고 함수를 실행함, 
//                       동시성 값이 1,000개라면 서울 리전 안에 동시 최대 실행 갯수가 1,000개. 
//                       이때 API Gateway의 Rate가 10,000개인데 Lambda함수가 2s에 한개씩 처리하고 동시성이 1,000개라면 Lambda에서 API Gateway의 요청을 전부 처리하지 못하니 주의해야함