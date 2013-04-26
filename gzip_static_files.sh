#! /bin/bash

# this script checks a list of directories for a list of extensions and
# generated gzipped versions of the files that are found
#
# if the modification date of a file is newer than its gzipped version
# then the gzip file is regenerated
 
# specify a filetype like *.css or a filename like index.html
# leave one space between entries
FILETYPES="*.css *.jpg *.jpeg *.gif *.png *.js *.html"

# specify a list of directories to check recursively
DIRECTORIES=$1

for currentdir in $DIRECTORIES
do
   for extension in $FILETYPES
   do
      find $currentdir -iname $extension -exec bash -c 'PLAINFILE={};GZIPPEDFILE={}.gz; \
         if [ -e $GZIPPEDFILE ]; \
         then   if [ `stat --printf=%Y $PLAINFILE` -gt `stat --printf=%Y $GZIPPEDFILE` ]; \
                then    echo "$GZIPPEDFILE outdated, regenerating"; \
                        gzip -9 -f -n -c $PLAINFILE > $GZIPPEDFILE; \
                 fi; \
         else echo "$GZIPPEDFILE is missing, creating it"; \
              gzip -9 -n -c $PLAINFILE > $GZIPPEDFILE; \
         fi' \;
   done
done