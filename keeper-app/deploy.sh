#!/usr/bin/env bash
ng build --prod
aws s3 rm s3://keeper.voget.io --recursive
aws s3 cp ./dist/keeper-app/ s3://keeper.voget.io --recursive