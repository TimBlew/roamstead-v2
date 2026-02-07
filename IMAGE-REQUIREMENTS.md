# Image Requirements for Roamstead V2

## Required Images and Dimensions

Place all images in `/public/images/` directory.

### Hero Section
- **hero-mountain.jpg**
  - Recommended: 1920x1080px (16:9)
  - Usage: Main hero background image
  - Should show: Mountain landscape, ideally Heber Valley area

### Value Cards Section (3 images)
- **community-first.jpg**
  - Recommended: 800x600px (4:3)
  - Usage: Community first value card
  - Should show: People gathering, community activities
  
- **four-season.jpg**
  - Recommended: 800x600px (4:3)
  - Usage: Four-season living value card
  - Should show: Seasonal activities (biking, skiing, etc.)
  
- **local-nature.jpg**
  - Recommended: 800x600px (4:3)
  - Usage: Local by nature value card
  - Should show: Nature scenes, local landscapes

### Primary Featured Property (Senator)
- **senator-main.jpg**
  - Recommended: 1200x800px
  - Usage: Main featured image for Senator property (large display)
  - Should show: Exterior shot of Senator building

### Secondary Property Cards
- **hugge-house.jpg**
  - Recommended: 800x600px
  - Usage: Hugge House property card
  - Should show: Exterior of Hugge House

- **granary.jpg**
  - Recommended: 800x600px
  - Usage: Granary property card
  - Should show: Exterior of Granary

- **daystar.jpg**
  - Recommended: 800x600px
  - Usage: Daystar property card
  - Should show: Exterior of Daystar

## Image Optimization Tips

1. **Format**: Use .jpg for photos, .png for graphics with transparency
2. **Compression**: Compress images to reduce file size (use tools like TinyPNG)
3. **Quality**: Aim for 80-85% quality for web
4. **Naming**: Use lowercase, hyphenated names (no spaces)
5. **Alt text**: Will be handled in components

## Directory Structure

```
public/
└── images/
    ├── hero-mountain.jpg
    ├── community-first.jpg
    ├── four-season.jpg
    ├── local-nature.jpg
    ├── senator-main.jpg
    ├── hugge-house.jpg
    ├── granary.jpg
    └── daystar.jpg
```

## Next Steps

Once you have your images ready:
1. Create the `/public/images/` directory
2. Add all images with the exact names above
3. Run `npm run dev` to see them in action
4. Adjust image paths in components if needed
