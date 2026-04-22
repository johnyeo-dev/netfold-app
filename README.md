# NetFold

Interactive PSLE Maths app for exploring 3D shapes and their nets.

## Included in this build
- 7 shapes in 3D: cube, cuboid, square pyramid, triangular pyramid, triangular prism, cylinder, cone
- Drag to rotate
- Mouse wheel / trackpad zoom
- Rotate, zoom, reset, auto-spin controls
- Net view for every shape
- Quiz mode with valid and invalid nets
- Label toggle for teaching support
- Resize handling for browser window changes

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel, click **Add New Project**.
3. Import the GitHub repo.
4. Framework preset: **Vite**.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy.

## Still not included yet
- Face-by-face fold animation
- Free build sandbox mode
- Bigger quiz bank per shape
- Net-to-3D transition animation
