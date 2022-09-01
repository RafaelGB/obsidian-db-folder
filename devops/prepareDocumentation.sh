#!/bin/zsh
git checkout $1
git add .
git commit -m "Update documentation"
git push origin $1