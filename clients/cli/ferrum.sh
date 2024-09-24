#!/bin/bash

# Default values
ip="127.0.0.1"
port="3000"

# Check if IP and port are passed as arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--host)
            ip="$2"
            shift 2
            ;;
        -p|--port)
            port="$2"
            shift 2
            ;;
        *)
            echo "Invalid argument: $1"
            exit 1
            ;;
    esac
done
