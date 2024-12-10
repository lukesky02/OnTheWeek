import AWS from 'aws-sdk';

const s3 = new AWS.S3();
const BUCKET_NAME = 'your-s3-bucket-name';

export const saveLogToS3 = async (logData) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `logs/${Date.now()}.json`,
    Body: JSON.stringify(logData),
    ContentType: 'application/json',
  };

  try {
    await s3.putObject(params).promise();
  } catch (error) {
    console.error('Error saving log to S3:', error);
    throw error;
  }
};
