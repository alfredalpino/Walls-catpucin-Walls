#!/bin/bash
# Script to regenerate images.json with all wallpaper files

echo "Generating images.json..."

# Find all image files and create JSON array
find . -maxdepth 1 -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" \) ! -name "README.md" -exec basename {} \; | sort | \
awk 'BEGIN { print "[" } 
     { if (NR > 1) print ","; printf "  \"%s\"", $0 }
     END { print "\n]" }' > images.json

echo "Done! Found $(grep -c '"' images.json | awk '{print $1/2}') images."
