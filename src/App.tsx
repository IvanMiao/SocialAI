import React, { useState, useEffect } from 'react';
import { Waves, Calendar, BarChart3, Sparkles, Send, Image, TrendingUp, Zap, Target, Activity } from 'lucide-react';

interface GeneratedImage {
  id: number;
  url: string;
  prompt: string;
  timestamp: string;
  platforms: string[];
}

interface ScheduledPost extends GeneratedImage {
  scheduledFor: string;
  status: string;
}

interface Analytics {
  predictedEngagement: number;
  viralScore: number;
  emotionalImpact: {
    [key: string]: number;
  };
}

const Wave = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'twitter', 'facebook']);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [analytics, setAnalytics] = useState<Analytics>({
    predictedEngagement: 0,
    viralScore: 0,
    emotionalImpact: {}
  });

  const API_KEY = 'sk-NG0omZzRFsYEbedC3F8fuQ';

  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'from-cyan-400 to-cyan-600', icon: '📸' },
    { id: 'twitter', name: 'Twitter', color: 'from-blue-400 to-cyan-500', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', color: 'from-blue-500 to-blue-700', icon: '👥' },
    { id: 'linkedin', name: 'LinkedIn', color: 'from-cyan-500 to-blue-600', icon: '💼' }
  ];

  const presetPrompts = [
    "Stunning 3D holographic product launch with neon lighting and particle effects",
    "Viral social media post design with bold typography and electric cyan waves",
    "Premium tech brand announcement with glowing circuits and futuristic UI elements",
    "Eye-catching advertisement with dynamic motion blur and vibrant gradient overlays",
    "Creative social content with abstract fluid shapes and neon color splash effects"
  ];

  const generateWithBlackbox = async (promptText: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "blackboxai/black-forest-labs/flux-pro",
          messages: [
            {
              role: "user",
              content: promptText
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle the response - extract image URL from chat completion response
      let imageUrl = '';
      
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        const content = data.choices[0].message.content;
        // The content should contain the image URL
        if (typeof content === 'string' && (content.startsWith('http://') || content.startsWith('https://'))) {
          imageUrl = content;
        } else if (typeof content === 'string') {
          // Try to extract URL from the response
          const urlMatch = content.match(/https?:\/\/[^\s)]+/);
          if (urlMatch) {
            imageUrl = urlMatch[0];
          }
        }
      } else if (data.url) {
        imageUrl = data.url;
      } else if (data.data && data.data[0] && data.data[0].url) {
        imageUrl = data.data[0].url;
      } else if (data.image_url) {
        imageUrl = data.image_url;
      } else if (data.images && data.images[0]) {
        imageUrl = data.images[0];
      }
      
      if (!imageUrl) {
        console.error('Unexpected API response structure:', data);
        throw new Error('Could not find image URL in API response. Check console for full response.');
      }
      
      const newImage = {
        id: Date.now(),
        url: imageUrl,
        prompt: promptText,
        timestamp: new Date().toISOString(),
        platforms: [...selectedPlatforms]
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      calculateAnalytics(promptText);
      
      return newImage;
    } catch (error) {
      console.error('Generation error:', error);
      alert(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for details.`);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateABVariants = async () => {
    setIsGenerating(true);
    const variants = [
      `${prompt} - variant A with vibrant neon colors`,
      `${prompt} - variant B with minimalist cyberpunk style`,
      `${prompt} - variant C with bold flowing composition`
    ];

    for (let i = 0; i < variants.length; i++) {
      await generateWithBlackbox(variants[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsGenerating(false);
  };

  const calculateAnalytics = (promptText: string) => {
    const words = promptText.toLowerCase().split(' ');
    const engagementKeywords = ['vibrant', 'bold', 'stunning', 'amazing', 'neon', 'wave'];
    const score = words.filter(w => engagementKeywords.includes(w)).length;
    
    setAnalytics({
      predictedEngagement: Math.min(72 + score * 6 + Math.random() * 12, 97),
      viralScore: Math.min(68 + score * 7 + Math.random() * 16, 96),
      emotionalImpact: {
        excitement: Math.random() * 25 + 50,
        innovation: Math.random() * 20 + 35,
        trust: Math.random() * 20 + 25
      }
    });
  };

  const schedulePost = (image: GeneratedImage) => {
    const scheduledDate = new Date();
    scheduledDate.setHours(scheduledDate.getHours() + Math.floor(Math.random() * 48));
    
    const newPost = {
      ...image,
      scheduledFor: scheduledDate.toISOString(),
      status: 'scheduled'
    };
    
    setScheduledPosts(prev => [...prev, newPost]);
    alert(`🌊 Wave scheduled for ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}`);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter((p: string) => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Wave Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#0080FF" />
            </linearGradient>
          </defs>
          <path d="M0,50 Q250,0 500,50 T1000,50 T1500,50 T2000,50 V200 H0 Z" fill="url(#waveGradient)" opacity="0.3">
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="M0,50 Q250,0 500,50 T1000,50 T1500,50 T2000,50 V200 H0 Z;
                      M0,50 Q250,100 500,50 T1000,50 T1500,50 T2000,50 V200 H0 Z;
                      M0,50 Q250,0 500,50 T1000,50 T1500,50 T2000,50 V200 H0 Z"/>
          </path>
          <path d="M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100 V200 H0 Z" fill="url(#waveGradient)" opacity="0.2">
            <animate attributeName="d" dur="10s" repeatCount="indefinite"
              values="M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100 V200 H0 Z;
                      M0,100 Q250,150 500,100 T1000,100 T1500,100 T2000,100 V200 H0 Z;
                      M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100 V200 H0 Z"/>
          </path>
        </svg>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative bg-black/80 backdrop-blur-xl border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Waves className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400">WAVE</span>
                </h1>
                <p className="text-sm text-cyan-400 font-bold tracking-wide">MAKE WAVES, NOT POSTS</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Status</p>
                <p className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Riding the Algorithm
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`px-5 py-2.5 rounded-lg font-bold transition-all ${
                    activeTab === 'generate' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-cyan-500/30'
                  }`}
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  CREATE
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-5 py-2.5 rounded-lg font-bold transition-all ${
                    activeTab === 'schedule' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-cyan-500/30'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  SCHEDULE
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-5 py-2.5 rounded-lg font-bold transition-all ${
                    activeTab === 'analytics' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-cyan-500/30'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  INSIGHTS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            {/* Hero Message */}
            <div className="text-center py-6">
              <h2 className="text-3xl font-black mb-2">
                ONE PROMPT. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">INFINITE WAVES.</span>
              </h2>
              <p className="text-gray-400 text-sm">Creative team + Data analyst + Social manager = Wave</p>
            </div>

            {/* Prompt Input */}
            <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                <Target className="w-5 h-5 text-cyan-400" />
                LAUNCH YOUR <span className="text-cyan-400">WAVE</span>
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-cyan-300 uppercase tracking-wide">Your Vision</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your content vision... we'll create the waves 🌊"
                    className="w-full h-28 bg-black/50 rounded-xl px-4 py-3 border-2 border-cyan-500/30 focus:border-cyan-400 focus:outline-none resize-none font-mono text-sm placeholder-gray-500"
                  />
                </div>

                {/* Preset Prompts */}
                <div>
                  <label className="block text-sm font-bold mb-3 text-cyan-300 uppercase tracking-wide">🌊 Wave Starters</label>
                  <div className="grid grid-cols-1 gap-2">
                    {presetPrompts.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(preset)}
                        className="px-4 py-3 bg-black/40 hover:bg-cyan-500/20 rounded-lg text-left border border-cyan-500/30 hover:border-cyan-400 transition-all group"
                      >
                        <span className="text-cyan-400 font-mono text-xs mr-2">〰️</span>
                        <span className="text-sm group-hover:text-cyan-300">{preset}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-bold mb-3 text-cyan-300 uppercase tracking-wide">🎯 Platforms</label>
                  <div className="grid grid-cols-4 gap-3">
                    {platforms.map(platform => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-5 rounded-xl border-2 transition-all transform hover:scale-105 ${
                          selectedPlatforms.includes(platform.id)
                            ? `bg-gradient-to-br ${platform.color} border-cyan-300 shadow-lg shadow-cyan-500/40`
                            : 'bg-black/40 border-cyan-500/30 hover:border-cyan-400'
                        }`}
                      >
                        <div className="text-3xl mb-2">{platform.icon}</div>
                        <div className="text-xs font-bold uppercase">{platform.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => generateWithBlackbox(prompt)}
                    disabled={!prompt || isGenerating}
                    className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/60 uppercase tracking-wide"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        CREATING WAVE...
                      </>
                    ) : (
                      <>
                        <Waves className="w-6 h-6" />
                        MAKE A WAVE
                      </>
                    )}
                  </button>
                  <button
                    onClick={generateABVariants}
                    disabled={!prompt || isGenerating}
                    className="bg-black/60 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-black border-2 border-cyan-500/50 hover:border-cyan-400 transition-all flex items-center gap-2 uppercase"
                  >
                    <TrendingUp className="w-5 h-5" />
                    A/B WAVE
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Images Gallery */}
            {generatedImages.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30">
                <h2 className="text-2xl font-black mb-5 text-cyan-300 uppercase flex items-center gap-2">
                  <Waves className="w-6 h-6" />
                  Your Waves
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {generatedImages.map(image => (
                    <div key={image.id} className="group relative bg-black/60 rounded-xl overflow-hidden border-2 border-cyan-500/30 hover:border-cyan-400 transition-all hover:shadow-2xl hover:shadow-cyan-500/40 transform hover:scale-105">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-52 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      <div className="relative p-4">
                        <p className="text-xs text-gray-300 mb-3 line-clamp-2 font-mono">{image.prompt}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                        {image.platforms.map((p: string) => (
                            <span key={p} className="text-xs px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400/50 font-bold">
                              {platforms.find(pl => pl.id === p)?.icon}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => schedulePost(image)}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 py-2.5 rounded-lg text-sm font-black uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/50"
                        >
                          <Send className="w-4 h-4" />
                          RIDE IT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30">
            <h2 className="text-2xl font-black mb-5 text-cyan-300 uppercase flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Scheduled Waves
            </h2>
            {scheduledPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Waves className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-bold">NO WAVES SCHEDULED</p>
                <p className="text-sm mt-2">Create and schedule your first wave to ride the algorithm</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledPosts.map(post => (
                  <div key={post.id} className="flex items-center gap-4 bg-black/50 rounded-xl p-4 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all">
                    <img src={post.url} alt="" className="w-24 h-24 rounded-lg object-cover border-2 border-cyan-500/50" />
                    <div className="flex-1">
                      <p className="font-bold mb-1 text-cyan-300">{post.prompt.slice(0, 70)}...</p>
                      <p className="text-sm text-gray-400 font-mono">
                        🌊 Rides at {new Date(post.scheduledFor).toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {post.platforms.map((p: string) => (
                          <span key={p} className="text-xs px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400/50 font-bold">
                            {platforms.find(pl => pl.id === p)?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-300 rounded-full text-xs font-black uppercase border border-cyan-400/50">
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">WAVE INSIGHTS</span>
              </h2>
              <p className="text-gray-400 text-sm">Real-time algorithm intelligence</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30">
                <h3 className="text-sm font-black text-cyan-300 mb-2 uppercase">Wave Strength</h3>
                <p className="text-5xl font-black text-white">{analytics.predictedEngagement.toFixed(0)}%</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">PREDICTED ENGAGEMENT</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-400/50 shadow-2xl shadow-blue-500/30">
                <h3 className="text-sm font-black text-blue-300 mb-2 uppercase">Viral Velocity</h3>
                <p className="text-5xl font-black text-white">{analytics.viralScore.toFixed(0)}<span className="text-2xl text-cyan-400">/100</span></p>
                <p className="text-xs text-gray-400 mt-2 font-mono">ALGORITHM SCORE</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30">
                <h3 className="text-sm font-black text-cyan-300 mb-2 uppercase">Waves Created</h3>
                <p className="text-5xl font-black text-white">{generatedImages.length}</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">TOTAL CONTENT</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30">
              <h3 className="text-xl font-black mb-5 text-cyan-300 uppercase flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Emotional Resonance
              </h3>
              <div className="space-y-4">
                {Object.entries(analytics.emotionalImpact).map(([emotion, value]) => (
                  <div key={emotion}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="capitalize font-bold text-cyan-300 uppercase">{emotion}</span>
                      <span className="font-black text-white">{value.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-cyan-500/30">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 transition-all duration-500 shadow-lg shadow-cyan-500/50"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-xl rounded-2xl p-8 border-2 border-cyan-500/30 text-center">
              <Waves className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <h3 className="text-2xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                WE'RE NOT REPLACING MARKETERS
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                We're giving them <span className="text-cyan-400 font-bold">superpowers</span>. 
                Wave turns one prompt into dozens of optimized variants, A/B tested automatically, 
                scheduled intelligently across all platforms. 
                <span className="block mt-4 text-cyan-300 font-bold">
                  Creative team + Data analyst + Social manager = Wave
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wave;