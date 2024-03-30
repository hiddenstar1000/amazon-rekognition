const AWS = require("aws-sdk");

const rekognition = new AWS.Rekognition();

exports.handler = async (event, context) => {
  try {
    const record = event.Records[0];
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    const params = {
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: objectKey,
        },
      },
    };

    const data = await rekognition.detectFaces(params).promise();

    if (data.FaceDetails.length > 0) {
      console.log("Faces detected:");
      data.FaceDetails.forEach((face, index) => {
        console.log(`Face ${index + 1}:`);
        console.log(`  Age: ${face.AgeRange.Low}-${face.AgeRange.High}`);
        console.log(`  Gender: ${face.Gender.Value}`);
        console.log(
          `  Emotions: ${face.Emotions.map((emotion) => emotion.Type).join(
            ", "
          )}`
        );
      });
    } else {
      console.log("No faces detected.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Face detection completed successfully.",
      }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred during face detection.",
      }),
    };
  }
};
