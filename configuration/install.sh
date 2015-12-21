#!/bin/bash
npm install

cd ./client
npm install
npm install ionic -g

webpack
gulp compress-bundle
