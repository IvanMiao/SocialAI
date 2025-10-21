# Wave - Social AI Studio

**BlackboxAI Hackathon 42 Paris Team 10**

## 🌊 About Wave

Wave is a revolutionary social media content creation platform that combines the power of AI with intelligent scheduling and analytics. One prompt generates infinite waves of optimized content across all your social platforms.

**Creative team + Data analyst + Social manager = Wave**

## 🚀 Features

- **AI-Powered Content Generation**: Create stunning visuals from text prompts
- **Multi-Platform Support**: Instagram, Twitter, Facebook, LinkedIn
- **A/B Testing**: Generate multiple variants automatically
- **Smart Scheduling**: Intelligent post timing across platforms
- **Real-Time Analytics**: Track engagement, viral potential, and emotional impact
- **Preset Prompts**: Quick-start templates for common content types

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Blackbox AI (placeholder implementation)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development

The app will be available at `http://localhost:5173/` after running `npm run dev`.

### Project Structure

```
SocialAI/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Static assets
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🔌 API Integration

### Blackbox AI Image Generation

The app is integrated with the Blackbox AI image generation API at `https://api.blackbox.ai/v1/images/generations`.

**Current Configuration:**
```typescript
{
  prompt: string,      // Your text prompt
  model: "flux-pro",   // AI model to use
  width: 1024,         // Image width
  height: 1024,        // Image height
  steps: 30            // Generation steps
}
```

The app handles various response formats and will display appropriate error messages if the API call fails. Check the browser console for detailed error information.

**API Key**: The API key is stored in the `API_KEY` constant in `src/App.tsx`. Update it if needed.

## 🎨 Features Overview

### Generate Tab
- Text prompt input with preset templates
- Platform selection (Instagram, Twitter, Facebook, LinkedIn)
- Single generation or A/B variant testing
- Real-time image gallery

### Schedule Tab
- View all scheduled posts
- Platform-specific scheduling
- Status tracking

### Analytics Tab
- Wave Strength (predicted engagement)
- Viral Velocity score
- Emotional Resonance metrics
- Total content created

## 🌟 Design Philosophy

Wave doesn't replace marketers—it gives them superpowers. The platform automates the repetitive tasks of content creation, A/B testing, and scheduling, allowing marketers to focus on strategy and creativity.

## 📝 License

This project was created for the BlackboxAI Hackathon at 42 Paris.

## 👥 Team

Team 10 - 42 Paris

---

**Make Waves, Not Posts** 🌊
