
const axios = require("axios");
const User = require("../models/user");

// AI Feature 2: Skill Demand Trends Analysis
const analyzeTrends = async (req, res) => {
    try {
        const { trends } = req.body;

        if (!Array.isArray(trends) || trends.length === 0) {
            return res.status(400).json({
                message: "Trend data is required",
            });
        }

        const prompt = `
You are an AI skill-demand analyst for SkillSwap.

Analyze these real community statistics:
${JSON.stringify(trends)}

Identify:
1. Most in-demand skills.
2. Largest demand-supply gaps.
3. Balanced skills.
4. Useful learning recommendations.

Do not invent numbers.

Respond in valid JSON:
{
  "summary": "Short overall trend summary",
  "trendingSkills": [
    {
      "skill": "React",
      "reason": "Short reason",
      "recommendation": "Short recommendation"
    }
  ],
  "recommendations": [
    {
      "skill": "React",
      "message": "Short recommendation for users"
    }
  ]
}
`;

        const aiResponse = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                response_format: { type: "json_object" },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.AI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            }
        );

        const result = JSON.parse(
            aiResponse.data.choices[0].message.content
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(
            "AI trends error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to analyze skill trends",
        });
    }
};


// AI Feature 3: Personalised Learning Path
const generateLearningPath = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const skillsToLearn = user.skillsToLearn || [];
        const skillsToTeach = user.skillsToTeach || [];

        if (skillsToLearn.length === 0) {
            return res.status(400).json({
                message: "Please add skills you want to learn to your profile.",
            });
        }

        const prompt = `
You are an expert AI learning-path advisor for SkillSwap.

Create personalised learning paths using the user's profile.

Skills the user wants to learn:
${JSON.stringify(skillsToLearn)}

Skills the user already knows and can teach:
${JSON.stringify(skillsToTeach)}

For each skill the user wants to learn:
1. Create exactly 4 concise learning steps in a logical order.
2. Keep each description and activity to one short sentence.
3. Progress from beginner to practical application.
4. Include a short description for each step.
5. Suggest a small practical activity or project.

Only recommend relevant steps. Do not assume the user already knows skills unless they appear in their profile.

Respond STRICTLY in valid JSON:

{
  "summary": "Short personalised learning overview",
  "learningPaths": [
    {
      "skill": "React",
      "level": "Beginner",
      "steps": [
        {
          "title": "JavaScript Fundamentals",
          "description": "Understand ES6, functions, arrays and objects.",
          "activity": "Build a small JavaScript application."
        }
      ]
    }
  ]
}
`;

        const aiResponse = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.4,
                max_completion_tokens: 2000,
                response_format: { type: "json_object" },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.AI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 20000,
            }
        );

        const result = JSON.parse(
            aiResponse.data.choices[0].message.content
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(
            "AI learning path error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to generate learning path",
        });
    }
};

module.exports = {
    analyzeTrends,
    generateLearningPath,
};
