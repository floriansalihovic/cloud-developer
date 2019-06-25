AWS_IAM_ROLE_NAME=udagram-opencv
AWS_S3_BUCKET_NAME=udagramdev
AWS_LAMBDA_FUNCTION_NAME=handler
AWS_LAMBDA_FUNCTION_PACKAGE_NAME=lambda.zip
AWS_LAMBDA_LAYER_NAME=cv2
AWS_LAMBDA_LAYER_DESCRIPTION=Open CV
AWS_LAMBDA_LAYER_PACKAGE_PYTHON36=cv2-python36.zip
DOCKER_IMAGE_NAME=lambda-layer-factory

clean:
	echo "--profile ${AWS_CLI_PROFILE} --region ${AWS_REGION}"
	rm -f ${AWS_LAMBDA_FUNCTION_PACKAGE_NAME}
	rm -f ${AWS_LAMBDA_LAYER_PACKAGE_PYTHON36}
	aws lambda delete-function \
		--function-name ${AWS_LAMBDA_FUNCTION_NAME} \
		--profile ${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}
	aws lambda delete-layer-version \
		--layer-name ${AWS_LAMBDA_LAYER_NAME} \
		--version-number $(shell aws lambda list-layer-versions \
				--layer-name ${AWS_LAMBDA_LAYER_NAME} \
				--profile ${AWS_CLI_PROFILE} \
				--region ${AWS_REGION} | jq -r '.LayerVersions[0].LayerVersionArn')
	aws iam detach-role-policy \
		--policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
		--role-name ${ROLE_NAME} \
		--profile ${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}
	aws iam detach-role-policy \
		--policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
		--role-name ${ROLE_NAME} \
		--profile ${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}
	aws iam delete-role \
		--role-name ${ROLE_NAME} \
		--profile ${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}

local:
	pip3 install -r requirements.txt

aws_create_roles:
	aws iam create-role --role-name ${AWS_IAM_ROLE_NAME} \
    	--assume-role-policy-document '{"Version":"2012-10-17","Statement":{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}}' \
    	--profile=${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}
	aws iam attach-role-policy \
		--policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
		--role-name ${AWS_IAM_ROLE_NAME} \
		--profile=${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}
	aws iam attach-role-policy \
		--policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
		--role-name ${AWS_IAM_ROLE_NAME} \
		--profile=${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}

aws_bucket:
	aws s3 mb s3://${AWS_S3_BUCKET_NAME} \
		--profile ${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}

aws_lambda_package:
	cd lambda; zip ../${AWS_LAMBDA_FUNCTION_PACKAGE_NAME} opencv_lambda.py; cd ..

aws_lambda_upload: aws_lambda_package
	aws s3 cp ${AWS_LAMBDA_FUNCTION_PACKAGE_NAME} s3://${AWS_S3_BUCKET_NAME} \
		--profile=${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}

aws_lambda_publish: aws_lambda_upload
	aws lambda create-function \
		--function-name ${AWS_LAMBDA_FUNCTION_NAME} \
		--timeout 10 \
		--role arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_IAM_ROLE_NAME} \
		--handler opencv_lambda.handler \
		--runtime python3.6 \
		--environment "Variables={BUCKET_NAME=${AWS_S3_BUCKET_NAME}}" \
		--code S3Bucket="${AWS_S3_BUCKET_NAME}",S3Key="${AWS_LAMBDA_FUNCTION_PACKAGE_NAME}" \
		--profile ${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}

aws_lambda_layer_upload:
	aws s3 cp cv2-python36.zip s3://${AWS_S3_BUCKET_NAME} \
		--profile ${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}

aws_lambda_layer_publish:
	aws lambda publish-layer-version \
		--layer-name ${AWS_LAMBDA_LAYER_NAME} \
		--description "Open CV" \
		--content S3Bucket=${AWS_S3_BUCKET_NAME},S3Key=cv2-python36.zip \
		--compatible-runtimes python3.6 \
		--profile ${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}

aws_lambda_layer_attach:
	aws lambda update-function-configuration \
		--function-name ${AWS_LAMBDA_FUNCTION_NAME} \
		--layers $(shell aws lambda list-layer-versions \
				--layer-name ${AWS_LAMBDA_LAYER_NAME} \
				--profile ${AWS_CLI_PROFILE} \
				--region ${AWS_REGION} | jq -r '.LayerVersions[0].LayerVersionArn') \
		--profile ${AWS_CLI_PROFILE} \
		--region ${AWS_REGION}

aws_docker_build:
	docker build --tag=${DOCKER_IMAGE_NAME}:latest .

aws_docker_run: aws_docker_build
	docker run --rm -it -v $(shell pwd):/data ${DOCKER_IMAGE_NAME} cp /packages/${AWS_LAMBDA_LAYER_PACKAGE_PYTHON36} /data

