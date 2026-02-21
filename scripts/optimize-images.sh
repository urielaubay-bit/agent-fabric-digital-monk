#!/bin/bash

# Optimize JPEG images
find public/images -type f -name "*.jpg" -exec jpegoptim --strip-all --max=85 {} \;

# Optimize PNG images
find public/images -type f -name "*.png" -exec optipng -o5 {} \;

# Resize large images
find public/images -type f \( -name "*.jpg" -o -name "*.png" \) -exec convert {} -resize "1920>" {} \;

echo "Image optimization complete."