// Find all jobs that require a particular skill

MATCH (j:Job)-[:REQUIRES]->(s:Skill)
WHERE s.name = $skill
RETURN
    j.id AS jobId,
    j.title AS title,
    j.location AS location,
    j.salary AS salary,
    j.remote AS remote
ORDER BY j.title;