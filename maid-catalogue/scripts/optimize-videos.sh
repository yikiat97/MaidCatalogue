#!/bin/bash

# Video Optimization Script for Easy Hire
# This script converts and compresses MOV files to web-optimized MP4 and WebM formats

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎥 Easy Hire Video Optimization Script${NC}"
echo "=========================================="

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ Error: ffmpeg is not installed${NC}"
    echo "Please install ffmpeg to use this script:"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install ffmpeg"
    echo "  macOS: brew install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/"
    exit 1
fi

# Define paths
ASSETS_DIR="/home/workspace/Documents/GitHub/maid-catalogue-zoey/public/assets"
TEMP_DIR="${ASSETS_DIR}/temp"
BACKUP_DIR="${ASSETS_DIR}/original"

# Create directories
mkdir -p "$TEMP_DIR"
mkdir -p "$BACKUP_DIR"

# Video files to optimize
declare -A VIDEOS=(
    ["rawvideo.MOV"]="rawvideo"
    ["aboutfounder.mov"]="aboutfounder"
    ["historyofEH.mov"]="historyofEH"
)

echo -e "${YELLOW}📁 Working directory: $ASSETS_DIR${NC}"
echo ""

# Function to get video info
get_video_info() {
    local input_file="$1"
    echo -e "${YELLOW}📊 Analyzing: $(basename "$input_file")${NC}"
    
    if [ -f "$input_file" ]; then
        local size=$(du -h "$input_file" | cut -f1)
        local duration=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$input_file" 2>/dev/null)
        local resolution=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$input_file" 2>/dev/null)
        
        echo "  📏 Size: $size"
        echo "  ⏱️  Duration: ${duration%.*}s"
        echo "  🖼️  Resolution: $resolution"
    else
        echo -e "  ${RED}❌ File not found${NC}"
    fi
}

# Function to create poster image
create_poster() {
    local input_file="$1"
    local output_name="$2"
    local poster_file="${ASSETS_DIR}/${output_name}-poster.jpg"
    
    echo -e "${YELLOW}🖼️  Creating poster image...${NC}"
    
    # Extract frame at 2 seconds (or 10% of duration if shorter)
    ffmpeg -i "$input_file" -ss 2 -vframes 1 -q:v 2 -y "$poster_file" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✅ Poster created: $(basename "$poster_file")${NC}"
    else
        echo -e "  ${RED}❌ Failed to create poster${NC}"
    fi
}

# Function to optimize video
optimize_video() {
    local input_file="$1"
    local output_name="$2"
    local backup_file="${BACKUP_DIR}/$(basename "$input_file")"
    
    echo -e "${GREEN}🔄 Optimizing: $(basename "$input_file")${NC}"
    
    # Backup original file
    if [ ! -f "$backup_file" ]; then
        cp "$input_file" "$backup_file"
        echo -e "  ${GREEN}💾 Backup created${NC}"
    fi
    
    # Create poster image
    create_poster "$input_file" "$output_name"
    
    # MP4 Optimization (H.264, optimized for web)
    echo -e "  ${YELLOW}🎬 Creating optimized MP4...${NC}"
    local mp4_output="${ASSETS_DIR}/${output_name}.mp4"
    
    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -preset medium \
        -crf 23 \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -pix_fmt yuv420p \
        -vf "scale=-2:min(720\,ih)" \
        -y "$mp4_output" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✅ MP4 created: $(basename "$mp4_output")${NC}"
    else
        echo -e "  ${RED}❌ MP4 creation failed${NC}"
        return 1
    fi
    
    # WebM Optimization (VP9, better compression)
    echo -e "  ${YELLOW}🎬 Creating WebM...${NC}"
    local webm_output="${ASSETS_DIR}/${output_name}.webm"
    
    ffmpeg -i "$input_file" \
        -c:v libvpx-vp9 \
        -crf 30 \
        -b:v 0 \
        -c:a libopus \
        -b:a 128k \
        -vf "scale=-2:min(720\,ih)" \
        -y "$webm_output" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✅ WebM created: $(basename "$webm_output")${NC}"
    else
        echo -e "  ${YELLOW}⚠️  WebM creation failed (VP9 might not be available)${NC}"
    fi
    
    # Show size comparison
    if [ -f "$mp4_output" ]; then
        local original_size=$(du -h "$input_file" | cut -f1)
        local new_size=$(du -h "$mp4_output" | cut -f1)
        echo -e "  📊 Size reduction: $original_size → $new_size"
    fi
    
    echo ""
}

# Main optimization process
echo -e "${GREEN}Starting video optimization...${NC}"
echo ""

for video_file in "${!VIDEOS[@]}"; do
    input_path="${ASSETS_DIR}/${video_file}"
    output_name="${VIDEOS[$video_file]}"
    
    if [ -f "$input_path" ]; then
        get_video_info "$input_path"
        optimize_video "$input_path" "$output_name"
    else
        echo -e "${RED}❌ File not found: $video_file${NC}"
        echo ""
    fi
done

# Summary
echo -e "${GREEN}🎉 Optimization Complete!${NC}"
echo "=========================================="
echo -e "${YELLOW}📁 Generated files:${NC}"
ls -la "$ASSETS_DIR" | grep -E "\.(mp4|webm|jpg)$" | grep -v original

echo ""
echo -e "${YELLOW}💾 Original files backed up to:${NC}"
echo "  $BACKUP_DIR"

echo ""
echo -e "${GREEN}🚀 Next steps:${NC}"
echo "1. Update video components to use new optimized files"
echo "2. Add multiple source elements for format fallbacks"  
echo "3. Implement progressive loading"
echo "4. Test on different devices and browsers"

echo ""
echo -e "${GREEN}✅ Video optimization script completed successfully!${NC}"