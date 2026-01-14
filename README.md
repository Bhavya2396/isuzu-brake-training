# 🚗 Interactive Brake Training Module

An immersive 3D training experience for brake pad replacement with AI-powered assistance.

## 🌐 Access the App

**Development Server**: http://localhost:5174/

## ✨ Features

### 12-Screen Training Flow
1. **Landing** - Interactive Toyota Land Cruiser with animated intro
2. **Learning Objectives** - Clear training outcomes
3. **Vehicle Context** - Brake system overview with labeled parts
4. **Safety Checklist** ⚠️ - Mandatory 4-item verification (blocks progress)
5. **Tools Overview** - Interactive 3D tool display
6. **Steps 1-5** - Complete brake pad replacement procedure
   - Wheel Removal
   - Caliper Access
   - Old Pad Removal
   - New Pad Installation
   - Reassembly
7. **Post-Installation** - Critical safety checks
8. **Quiz** - 5 scenario-based assessment questions
9. **Completion** - Score, achievements, and confetti celebration

### Interactive 3D Features
- **3 Complete Models**: Land Cruiser, Wheel Assembly, Disc Brake
- **3D Tools**: Ratchet wrench, torque wrench, car lift
- **Exploded View**: Toggle to see brake components separated
- **Part Highlighting**: Hover and click to explore
- **Camera Animations**: Smooth GSAP-powered transitions
- **HDRI Lighting**: Studio-quality environment

### AI Trainer
- **24/7 Assistant**: Gemini-powered chat (bottom-right button)
- **Contextual**: Knows current training step
- **Quick Suggestions**: Pre-filled common questions
- **Safety Focused**: Emphasizes best practices

## 🎮 Controls

- **Mouse Drag**: Rotate 3D view
- **Scroll**: Zoom in/out
- **Click Parts**: Select and view information
- **Exploded Button**: Toggle component separation
- **AI Button**: Open chat assistant

## 📁 Adding New Parts

### Step 1: Add Model Files
Place your GLTF/GLB files in:
```
public/models/
├── vehicles/        # Full vehicle models
├── components/      # Individual parts
└── tools/          # Tool models
```

### Step 2: Register in Config
Edit `public/parts.config.json`:
```json
{
  "models": {
    "components": [
      {
        "id": "your-part-id",
        "name": "Display Name",
        "path": "/models/components/your-part/scene.gltf",
        "scale": 1,
        "position": [0, 0, 0],
        "rotation": [0, 0, 0],
        "parts": {
          "MeshName": {
            "label": "Part Label",
            "description": "Part description",
            "explodeDir": [0, 1, 0],
            "explodeDistance": 0.5
          }
        }
      }
    ]
  }
}
```

### Step 3: Update Scene Config
Edit `src/components/canvas/Scene.tsx` to reference your new model.

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript
- **3D Engine**: Three.js + React Three Fiber
- **3D Tools**: @react-three/drei, @react-three/postprocessing
- **State**: Zustand
- **Animations**: GSAP + Framer Motion
- **Styling**: Tailwind CSS v3
- **AI**: Google Gemini API

## 🎨 Design System

### Colors
- **Primary**: `#00d4ff` (Electric Blue)
- **Highlight**: `#00ff88` (Bright Green)
- **Warning**: `#f59e0b` (Amber)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)
- **Background**: `#0a0a0f` to `#1a1a2e` (Dark Gradient)

### Typography
- **Font**: Space Grotesk (Google Fonts)

## 📝 Environment Variables

Create `.env` file:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Current key: `AIzaSyDBL65576riSeT3wUPiiQykb5Apb7tzJp4`

## 🐛 Troubleshooting

### Models Not Loading
- Check file paths in `parts.config.json`
- Verify GLTF files are in `public/models/`
- Open browser console for specific errors

### Styling Issues
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server

### AI Not Responding
- Verify Gemini API key in `.env`
- Check browser console for API errors
- Free tier has rate limits

## 📦 Project Structure

```
brake-training/
├── public/
│   ├── models/          # 3D model files
│   ├── hdri/           # Environment maps
│   └── parts.config.json
├── src/
│   ├── components/
│   │   ├── canvas/     # 3D scene components
│   │   └── ui/         # UI screens & shared components
│   ├── data/           # Training content
│   ├── services/       # API integrations
│   ├── store/          # State management
│   ├── types/          # TypeScript definitions
│   └── hooks/          # Custom React hooks
└── README.md
```

## 🎯 Next Steps

1. Open http://localhost:5174/
2. Click "Start Lesson"
3. Complete all 12 screens
4. Test the AI Trainer
5. Try adding your own 3D models!

---

**Built for Isuzu Dealership Training** | Demo Version
