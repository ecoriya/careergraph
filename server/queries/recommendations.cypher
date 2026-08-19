// Find jobs that match the user's existing skills

MATCH (u:User {id: $userId})
      -[:HAS_SKILL]->(s:Skill)
      -[:RELATED_TO]->(related:Skill)
      <-[:REQUIRES]-(j:Job)

RETURN DISTINCT
    j.id AS jobId,
    j.title AS title,
    related.name AS matchedRelatedSkill
ORDER BY j.title;