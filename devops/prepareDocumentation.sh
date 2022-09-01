#!/bin/zsh
# Give this exec privileges => chmod +x  devops/prepareDocumentation.sh  
git checkout $1
git add .
git commit -m "Update documentation"
git pull
git push origin $1