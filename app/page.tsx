'use client'

import { useState } from 'react'
import { Sparkles, Video, Share2, FileText, Loader2, CheckCircle } from 'lucide-react'

interface AgentStatus {
  script: 'idle' | 'working' | 'complete'
  video: 'idle' | 'working' | 'complete'
  post: 'idle' | 'working' | 'complete'
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [status, setStatus] = useState<AgentStatus>({
    script: 'idle',
    video: 'idle',
    post: 'idle'
  })
  const [script, setScript] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [postResult, setPostResult] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setIsProcessing(true)
    setError('')
    setScript('')
    setVideoUrl('')
    setPostResult('')
    setStatus({ script: 'working', video: 'idle', post: 'idle' })

    try {
      // Step 1: Generate Script
      const scriptRes = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform })
      })

      if (!scriptRes.ok) throw new Error('Script generation failed')

      const scriptData = await scriptRes.json()
      setScript(scriptData.script)
      setStatus(prev => ({ ...prev, script: 'complete', video: 'working' }))

      // Step 2: Generate Video
      const videoRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptData.script })
      })

      if (!videoRes.ok) throw new Error('Video generation failed')

      const videoData = await videoRes.json()
      setVideoUrl(videoData.videoUrl)
      setStatus(prev => ({ ...prev, video: 'complete', post: 'working' }))

      // Step 3: Post to Social Media
      const postRes = await fetch('/api/post-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: scriptData.script,
          videoUrl: videoData.videoUrl,
          platform
        })
      })

      if (!postRes.ok) throw new Error('Social posting failed')

      const postData = await postRes.json()
      setPostResult(postData.message)
      setStatus(prev => ({ ...prev, post: 'complete' }))

    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setStatus({ script: 'idle', video: 'idle', post: 'idle' })
    } finally {
      setIsProcessing(false)
    }
  }

  const StatusIcon = ({ state }: { state: 'idle' | 'working' | 'complete' }) => {
    if (state === 'working') return <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
    if (state === 'complete') return <CheckCircle className="w-5 h-5 text-green-400" />
    return <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Content Creator Agent
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Generate scripts, create videos, and post to social media automatically
          </p>
        </div>

        {/* Input Section */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Content Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., 5 tips for productivity"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white"
                disabled={isProcessing}
              >
                <option value="twitter">Twitter / X</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube Shorts</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Content
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Agent Pipeline Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <StatusIcon state={status.script} />
              <FileText className="w-6 h-6 text-purple-400" />
              <h3 className="font-semibold">Script Writer</h3>
            </div>
            <p className="text-sm text-gray-400">
              {status.script === 'working' && 'Writing engaging script...'}
              {status.script === 'complete' && 'Script completed'}
              {status.script === 'idle' && 'Waiting to start'}
            </p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <StatusIcon state={status.video} />
              <Video className="w-6 h-6 text-blue-400" />
              <h3 className="font-semibold">Video Generator</h3>
            </div>
            <p className="text-sm text-gray-400">
              {status.video === 'working' && 'Generating video content...'}
              {status.video === 'complete' && 'Video ready'}
              {status.video === 'idle' && 'Waiting for script'}
            </p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <StatusIcon state={status.post} />
              <Share2 className="w-6 h-6 text-pink-400" />
              <h3 className="font-semibold">Social Poster</h3>
            </div>
            <p className="text-sm text-gray-400">
              {status.post === 'working' && 'Posting to social media...'}
              {status.post === 'complete' && 'Successfully posted'}
              {status.post === 'idle' && 'Waiting for video'}
            </p>
          </div>
        </div>

        {/* Results */}
        {(script || videoUrl || postResult) && (
          <div className="space-y-6">
            {script && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-400" />
                  Generated Script
                </h3>
                <div className="bg-slate-800 rounded-lg p-4 whitespace-pre-wrap text-gray-300">
                  {script}
                </div>
              </div>
            )}

            {videoUrl && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Video className="w-6 h-6 text-blue-400" />
                  Generated Video
                </h3>
                <div className="bg-slate-800 rounded-lg p-4">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full max-w-2xl mx-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {postResult && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-pink-400" />
                  Social Media Post
                </h3>
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-200">
                  {postResult}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
