
import { S3 } from 'aws-sdk';

const s3Client = new S3(); // call s3

async function handler(event: any, context: any) {

    // list all buckets in s3 buckets
    const buckets = await s3Client.listBuckets().promise()
    console.log('Got an event:');
    console.log(event)
    return {
        statusCode: 200,
        body: "Here our S3 buckets" + JSON.stringify(buckets.Buckets)
    }

    // list our s3 bucket inside lambda
}

export {handler}