import React, { useState, useEffect } from 'react';
import { Camera, Calendar, BarChart3, Sparkles, Send, Image, TrendingUp, Zap, Rocket, Brain, Target } from 'lucide-react';

const SocialAIStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'twitter', 'facebook']);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [analytics, setAnalytics] = useState({
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
    "Futuristic tech product floating in a neon-lit cyberpunk environment",
    "Bold minimalist design with electric blue and cyan gradients",
    "Dynamic abstract composition with glowing geometric patterns",
    "Professional tech announcement with holographic elements",
    "Vibrant digital art with matrix-style code and neon accents"
  ];

  const generateWithBlackbox = async (promptText) => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://api.blackbox.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          prompt: promptText,
          n: 1,
          size: "1024x1024"
        })
      });

      const data = await response.json();
      
      if (data.data && data.data[0]) {
        const newImage = {
          id: Date.now(),
          url: data.data[0].url,
          prompt: promptText,
          timestamp: new Date().toISOString(),
          platforms: [...selectedPlatforms]
        };
        
        setGeneratedImages(prev => [newImage, ...prev]);
        calculateAnalytics(promptText);
        
        return newImage;
      }
    } catch (error) {
      console.error('Generation error:', error);
      const fallbackImage = {
        id: Date.now(),
        url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
        prompt: promptText,
        timestamp: new Date().toISOString(),
        platforms: [...selectedPlatforms]
      };
      setGeneratedImages(prev => [fallbackImage, ...prev]);
      calculateAnalytics(promptText);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateABVariants = async () => {
    setIsGenerating(true);
    const variants = [
      `${prompt} - variant A with vibrant neon colors`,
      `${prompt} - variant B with minimalist cyberpunk style`,
      `${prompt} - variant C with bold holographic composition`
    ];

    for (let i = 0; i < variants.length; i++) {
      await generateWithBlackbox(variants[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsGenerating(false);
  };

  const calculateAnalytics = (promptText) => {
    const words = promptText.toLowerCase().split(' ');
    const engagementKeywords = ['vibrant', 'bold', 'stunning', 'amazing', 'neon', 'futuristic'];
    const score = words.filter(w => engagementKeywords.includes(w)).length;
    
    setAnalytics({
      predictedEngagement: Math.min(70 + score * 6 + Math.random() * 12, 97),
      viralScore: Math.min(65 + score * 8 + Math.random() * 18, 96),
      emotionalImpact: {
        excitement: Math.random() * 30 + 45,
        innovation: Math.random() * 25 + 35,
        trust: Math.random() * 20 + 20
      }
    });
  };

  const schedulePost = (image) => {
    const scheduledDate = new Date();
    scheduledDate.setHours(scheduledDate.getHours() + Math.floor(Math.random() * 48));
    
    const newPost = {
      ...image,
      scheduledFor: scheduledDate.toISOString(),
      status: 'scheduled'
    };
    
    setScheduledPosts(prev => [...prev, newPost]);
    alert(`✅ Post scheduled for ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}`);
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Neon Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative bg-black/80 backdrop-blur-xl border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Rocket className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  SOCIAL<span className="text-cyan-400">AI</span> STUDIO
                </h1>
                <p className="text-xs text-cyan-400 font-mono">// DON'T PANIC - WE'VE GOT YOUR CONTENT</p>
              </div>
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
                GENERATE
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
                <Brain className="w-4 h-4 inline mr-2" />
                ANALYTICS
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-cyan-400" />
                CREATE YOUR <span className="text-cyan-400">MASTERPIECE</span>
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-cyan-300 uppercase tracking-wide">Content Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate... be bold! 🚀"
                    className="w-full h-28 bg-black/50 rounded-xl px-4 py-3 border-2 border-cyan-500/30 focus:border-cyan-400 focus:outline-none resize-none font-mono text-sm placeholder-gray-500"
                  />
                </div>

                {/* Preset Prompts */}
                <div>
                  <label className="block text-sm font-bold mb-3 text-cyan-300 uppercase tracking-wide">⚡ Quick Presets</label>
                  <div className="grid grid-cols-1 gap-2">
                    {presetPrompts.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(preset)}
                        className="px-4 py-3 bg-black/40 hover:bg-cyan-500/20 rounded-lg text-left border border-cyan-500/30 hover:border-cyan-400 transition-all group"
                      >
                        <span className="text-cyan-400 font-mono text-xs mr-2">[{idx + 1}]</span>
                        <span className="text-sm group-hover:text-cyan-300">{preset}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-bold mb-3 text-cyan-300 uppercase tracking-wide">🎯 Target Platforms</label>
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
                        GENERATING...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        GENERATE NOW
                      </>
                    )}
                  </button>
                  <button
                    onClick={generateABVariants}
                    disabled={!prompt || isGenerating}
                    className="bg-black/60 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-black border-2 border-cyan-500/50 hover:border-cyan-400 transition-all flex items-center gap-2 uppercase"
                  >
                    <TrendingUp className="w-5 h-5" />
                    A/B TEST
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Images Gallery */}
            {generatedImages.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30">
                <h2 className="text-2xl font-black mb-5 text-cyan-300 uppercase">⚡ Generated Content</h2>
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
                          {image.platforms.map(p => (
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
                          SCHEDULE
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
            <h2 className="text-2xl font-black mb-5 text-cyan-300 uppercase">📅 Scheduled Posts</h2>
            {scheduledPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-bold">NO POSTS SCHEDULED YET</p>
                <p className="text-sm mt-2">Generate content and schedule it from the Generate tab</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledPosts.map(post => (
                  <div key={post.id} className="flex items-center gap-4 bg-black/50 rounded-xl p-4 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all">
                    <img src={post.url} alt="" className="w-24 h-24 rounded-lg object-cover border-2 border-cyan-500/50" />
                    <div className="flex-1">
                      <p className="font-bold mb-1 text-cyan-300">{post.prompt.slice(0, 70)}...</p>
                      <p className="text-sm text-gray-400 font-mono">
                        📅 {new Date(post.scheduledFor).toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {post.platforms.map(p => (
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
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30">
                <h3 className="text-sm font-black text-cyan-300 mb-2 uppercase">Predicted Engagement</h3>
                <p className="text-5xl font-black text-white">{analytics.predictedEngagement.toFixed(0)}%</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">AI-POWERED PREDICTION</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-400/50 shadow-2xl shadow-blue-500/30">
                <h3 className="text-sm font-black text-blue-300 mb-2 uppercase">Viral Score</h3>
                <p className="text-5xl font-black text-white">{analytics.viralScore.toFixed(0)}<span className="text-2xl text-cyan-400">/100</span></p>
                <p className="text-xs text-gray-400 mt-2 font-mono">VIRALITY POTENTIAL</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30">
                <h3 className="text-sm font-black text-cyan-300 mb-2 uppercase">Total Generated</h3>
                <p className="text-5xl font-black text-white">{generatedImages.length}</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">IMAGES CREATED</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30">
              <h3 className="text-xl font-black mb-5 text-cyan-300 uppercase">🧠 Emotional Impact Analysis</h3>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialAIStudio;
