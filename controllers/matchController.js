
// const User = require("../models/user");

// const getMatches = async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.user.id)
//       .select("-password");

//     if (!currentUser) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const users = await User.find({
//       _id: { $ne: currentUser._id },
//     }).select("-password");

//     const myTeach = currentUser.skillsToTeach || [];
//     const myLearn = currentUser.skillsToLearn || [];

//     const normalize = (skill) => skill.trim().toLowerCase();

//     const matches = users
//       .map((user) => {
//         const userTeach = user.skillsToTeach || [];
//         const userLearn = user.skillsToLearn || [];

//         const userTeaches = myLearn.filter((skill) =>
//           userTeach.some(
//             (item) => normalize(item) === normalize(skill)
//           )
//         );

//         const matchTeaches = myTeach.filter((skill) =>
//           userLearn.some(
//             (item) => normalize(item) === normalize(skill)
//           )
//         );

//         const totalMatches =
//           userTeaches.length + matchTeaches.length;

//         if (totalMatches === 0) {
//           return null;
//         }

//         const matchPercentage =
//           totalMatches >= 2 ? 85 : 60;

//         return {
//           id: user._id,
//           name: user.name,
//           place: user.place,
//           description: user.description,
//           category: user.category,
//           skillsToTeach: userTeach,
//           skillsToLearn: userLearn,
//           userTeaches,
//           matchTeaches,
//           totalMatches,
//           matchPercentage,
//           scoreLabel:
//             matchPercentage >= 85 ? "Great" : "Good",
//         };
//       })
//       .filter(Boolean)
//       .sort(
//         (a, b) => b.matchPercentage - a.matchPercentage
//       );

//     res.status(200).json({
//       count: matches.length,
//       matches,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getMatches };

const User = require("../models/user");
const axios = require("axios");

const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select("-password");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({
      _id: { $ne: currentUser._id },
    }).select("-password");

    if (users.length === 0) {
      return res.status(200).json({ count: 0, matches: [] });
    }

    const myTeach = currentUser.skillsToTeach || [];
    const myLearn = currentUser.skillsToLearn || [];

    const prompt = `
      You are an intelligent matching engine for a SkillSwap platform.
      Analyze the current user and evaluate compatibility with candidate users based on semantic skill alignment (e.g., "React.js" matches well with "Frontend").

      Current User:
      - Skills Offered: ${JSON.stringify(myTeach)}
      - Skills Wanted: ${JSON.stringify(myLearn)}

      Candidates:
      ${JSON.stringify(
      users.map((c) => ({
        id: c._id,
        name: c.name,
        skillsToTeach: c.skillsToTeach || [],
        skillsToLearn: c.skillsToLearn || [],
      }))
    )}

      Task:
Evaluate EVERY candidate individually.

Assign a compatibility score from 0 to 100 based on:
- How well the candidate can teach skills the current user wants to learn.
- How well the candidate wants to learn skills the current user can teach.
- Semantic similarity between related skills.

Return exactly one result for every candidate.
Do not omit candidates, even if their compatibility score is 0.

Provide a short explanation for each score.
Return valid JSON only.
    `;

    let aiScoredList = [];

    try {
      // FIXED URL AND PROPER HEADERS
      const aiResponse = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'openai/gpt-oss-20b',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 8000
        }
      );

      const parsedData = JSON.parse(aiResponse.data.choices[0].message.content);
      aiScoredList = parsedData.matches || [];
    } catch (aiError) {
      console.warn("AI fallback triggered due to error:", aiError.response?.data || aiError.message);
    }

    // MAP MATCHES (With smart fallback if AI list is empty)
    const matches = users
      .map((user) => {
        const aiMeta = aiScoredList.find(
          (m) =>
            String(m.candidateId) === String(user._id)
        );

        let matchScore =
          aiMeta &&
            Number.isFinite(Number(aiMeta.matchScore)) &&
            Number(aiMeta.matchScore) >= 0 &&
            Number(aiMeta.matchScore) <= 100
            ? Number(aiMeta.matchScore)
            : null;

        let matchReason =
          matchScore !== null
            ? aiMeta.matchReason || "AI-based skill compatibility."
            : null;

        // Fallback calculation if AI failed or didn't return a score for this user
        if (matchScore === null) {
          const userTeach = user.skillsToTeach || [];
          const userLearn = user.skillsToLearn || [];

          const normalize = (s) => s.trim().toLowerCase();
          const sharedTeach = myLearn.filter((s) => userTeach.some((item) => normalize(item) === normalize(s)));
          const sharedLearn = myTeach.filter((s) => userLearn.some((item) => normalize(item) === normalize(s)));

          const totalMatches = sharedTeach.length + sharedLearn.length;
          if (totalMatches === 0) return null;

          matchScore = totalMatches >= 2 ? 85 : 60;
          matchReason = "Matched based on exact skill tags overlap.";
        }

        if (matchScore < 40) return null;

        const scoreLabel = matchScore >= 80 ? "Great" : matchScore >= 60 ? "Good" : "Fair";

        // Precompute userTeaches and matchTeaches for request modal compatibility
        const userTeach = user.skillsToTeach || [];
        const userLearn = user.skillsToLearn || [];
        const userTeaches = myLearn.filter((skill) => userTeach.some((item) => item.toLowerCase() === skill.toLowerCase()));
        const matchTeaches = myTeach.filter((skill) => userLearn.some((item) => item.toLowerCase() === skill.toLowerCase()));

        return {
          id: user._id,
          name: user.name,
          place: user.place,
          description: user.description,
          category: user.category,
          skillsToTeach: userTeach,
          skillsToLearn: userLearn,
          userTeaches,
          matchTeaches,
          totalMatches: userTeaches.length + matchTeaches.length,
          matchPercentage: matchScore,
          scoreLabel,
          matchReason,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      count: matches.length,
      matches,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMatches };
