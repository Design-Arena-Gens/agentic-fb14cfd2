import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Simulate AI script generation with a sophisticated template
    const platformGuidelines: Record<string, string> = {
      twitter: 'Keep it concise (280 characters max), engaging, and use hashtags',
      instagram: 'Make it visual, use emojis, and tell a story',
      tiktok: 'Make it trendy, fun, and hook viewers in first 3 seconds',
      youtube: 'Create a compelling hook, deliver value quickly (under 60 seconds)'
    }

    const script = generateScript(topic, platform, platformGuidelines[platform])

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    return NextResponse.json({
      script,
      platform,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Script generation error:', error)
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 })
  }
}

function generateScript(topic: string, platform: string, guidelines: string): string {
  const hooks = [
    "Wait, you need to see this!",
    "Here's something nobody tells you:",
    "This changed everything for me:",
    "Stop scrolling - this is important:",
    "You won't believe this:"
  ]

  const hook = hooks[Math.floor(Math.random() * hooks.length)]

  const scripts = {
    twitter: `${hook}

${topic}

Thread 🧵👇

1/ The first thing you need to know...
This simple technique can transform your approach completely.

2/ Here's what most people get wrong...
They focus on the wrong metrics and miss the bigger picture.

3/ The solution?
Start small, stay consistent, and track your progress daily.

Follow for more tips! 🚀

#productivity #tips #growth`,

    instagram: `✨ ${hook} ✨

${topic}

🎯 Swipe to discover:
→ The secret strategy nobody talks about
→ 3 actionable steps you can start TODAY
→ Real results you can achieve

💡 Pro tip: Save this post and come back to it when you need motivation!

Here's the breakdown:

1️⃣ Start with clarity
Know exactly what you want to achieve and why it matters.

2️⃣ Create a system
Build habits that make success inevitable.

3️⃣ Stay consistent
Small daily actions compound into massive results.

❤️ Double tap if this resonated!
💬 Comment "YES" if you're ready to take action!
🔔 Follow @yourhandle for daily value

#motivation #success #growthmindset #inspiration`,

    tiktok: `🔥 ${hook}

${topic}

*hook in first 3 seconds*

Okay so here's the tea...

Most people have NO IDEA about this simple trick that literally changed my life.

✨ The secret? ✨

It's not about working harder - it's about working SMARTER.

Here's what you do:

Step 1: Set a clear goal
Step 2: Break it into tiny steps
Step 3: Take action EVERY. SINGLE. DAY.

That's it. That's the secret.

No fancy hacks. No overnight success.

Just consistency + clarity = results ✅

Try this for 30 days and watch what happens 👀

Drop a 🔥 if you're gonna try this!

#fyp #viral #productivity #lifehacks #motivation`,

    youtube: `${hook}

${topic} - In Under 60 Seconds

Hey everyone! Today I'm breaking down the EXACT strategy that helped me transform my results.

First - understand this fundamental truth:
Success isn't about luck. It's about systems.

Here's the 3-step framework:

STEP 1: Define Your Target
Get crystal clear on what you want to achieve. Write it down.

STEP 2: Design Your System
Create daily habits that align with your goal. Make them so small you can't say no.

STEP 3: Track and Adjust
Monitor your progress weekly. What gets measured gets improved.

The magic happens when you combine clarity with consistency.

Start today. Your future self will thank you.

If this helped, smash that subscribe button and turn on notifications!

See you in the next one! 🚀

#shorts #productivity #success`
  }

  return scripts[platform as keyof typeof scripts] || scripts.twitter
}
