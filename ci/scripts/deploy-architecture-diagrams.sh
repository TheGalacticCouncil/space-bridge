#!/bin/bash

set -ev

echo "Build and deploy architecture diagrams into structurizr"
cd architecture
./gradlew run
