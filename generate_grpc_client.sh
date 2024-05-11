#!/bin/bash
PROTO_DIR=./ferrum/api/grpc_protocol
OUT_DIR_JS=./clients/nodejs/dist/proto
OUT_DIR_TS=./clients/nodejs/src/proto

mkdir -p $OUT_DIR_JS
mkdir -p $OUT_DIR_TS

npx grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:$OUT_DIR_JS \
    --grpc_out=grpc_js:$OUT_DIR_JS \
    --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
    -I $PROTO_DIR \
    $PROTO_DIR/*.proto

npx grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=grpc_js:$OUT_DIR_TS \
    -I $PROTO_DIR \
    $PROTO_DIR/*.proto

npx grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=grpc_js:$OUT_DIR_JS \
    -I $PROTO_DIR \
    $PROTO_DIR/*.proto