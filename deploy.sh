#!/bin/bash
echo Committing Changes and bumping version number.
node js/packageversionbump.js
echo Adding files to git
git add -A
echo Committing to git using first command line argument
git commit
echo Pushing to GIT repo
git push
echo Submitting to npm
sudo npm publish .
