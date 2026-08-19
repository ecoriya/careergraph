const express = require("express");
const cors = require("cors");
require("dotenv").config();

const driver = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CareerGraph API is running"
    });
});


// ==========================================
// HEALTH CHECK - COGNODB
// ==========================================

app.get("/api/health", async (req, res) => {
    const session = driver.session();

    try {
        const result = await session.run(
            "RETURN 'CognoDB connection successful' AS message"
        );

        res.json({
            success: true,
            message: result.records[0].get("message")
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to connect to CognoDB"
        });
    } finally {
        await session.close();
    }
});


// ==========================================
// GET JOBS BY SKILL
// Example:
// /api/jobs/skill/Java
// ==========================================

app.get("/api/jobs/skill/:skill", async (req, res) => {
    const session = driver.session();

    try {
        const { skill } = req.params;

        const result = await session.run(
            `
            MATCH (j:Job)-[:REQUIRES]->(s:Skill)
            WHERE s.name = $skill

            RETURN
                j.id AS jobId,
                j.title AS title,
                j.location AS location,
                j.salary AS salary,
                j.remote AS remote

            ORDER BY j.title
            `,
            {
                skill
            }
        );

        const jobs = result.records.map((record) => ({
            id: record.get("jobId"),
            title: record.get("title"),
            location: record.get("location"),
            salary: record.get("salary"),
            remote: record.get("remote")
        }));

        res.json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Job search error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch jobs"
        });

    } finally {
        await session.close();
    }
});


// ==========================================
// JOB RECOMMENDATIONS
//
// Multi-hop traversal:
//
// User
//   ↓ HAS_SKILL
// Skill
//   ↓ RELATED_TO
// Related Skill
//   ↓ REQUIRES
// Job
//
// Example:
// /api/recommendations/u1
// ==========================================

app.get("/api/recommendations/:userId", async (req, res) => {
    const session = driver.session();

    try {
        const { userId } = req.params;

        const result = await session.run(
            `
            MATCH (u:User {id: $userId})
                  -[:HAS_SKILL]->(s:Skill)
                  -[:RELATED_TO]->(related:Skill)
                  <-[:REQUIRES]-(j:Job)

            RETURN DISTINCT
                j.id AS jobId,
                j.title AS title,
                j.location AS location,
                j.salary AS salary,
                j.remote AS remote,
                related.name AS matchedSkill

            ORDER BY j.title
            `,
            {
                userId
            }
        );

        const recommendations = result.records.map((record) => ({
            id: record.get("jobId"),
            title: record.get("title"),
            location: record.get("location"),
            salary: record.get("salary"),
            remote: record.get("remote"),
            matchedSkill: record.get("matchedSkill")
        }));

        res.json({
            success: true,
            count: recommendations.length,
            recommendations
        });

    } catch (error) {
        console.error("Recommendation error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to generate job recommendations"
        });

    } finally {
        await session.close();
    }
});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});