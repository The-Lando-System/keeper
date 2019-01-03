#!/usr/bin/env bash

ERROR=$(ng build --prod 2>&1 >/dev/null)

if [ -z "$ERROR" ]
then
  echo "Build Success!"
  aws s3 rm s3://keeper.voget.io --recursive
  aws s3 cp ./dist/keeper-app/ s3://keeper.voget.io --recursive
else
  echo "$ERROR"
  echo "Build Failed..."
fi