#!/usr/bin/env bash
profileName=$1
if test -z "${profileName}"
then
      echo "A valid profile name must be given, no default will be applied of assumed."
      exit 1
else
    echo "Using profile ${profileName} to retrieve AWS account id and region."
fi

accountId=$(aws sts get-caller-identity --profile "${profileName}" | jq -r ".Account");
region=$(aws configure get region --profile "${profileName}");

rm "${profileName}_env.sh"
cat > "${profileName}_env.sh" <<EOL
#!/usr/bin/env bash
export AWS_CLI_PROFILE="${profileName}"
export AWS_ACCOUNT_ID="${accountId}"
export AWS_REGION="${region}"
EOL