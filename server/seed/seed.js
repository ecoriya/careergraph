require("dotenv").config();
const driver = require("../config/database");

async function seedDatabase() {
    const session = driver.session();

    try {
        console.log("Clearing existing CareerGraph data...");

        await session.run(`
            MATCH (n)
            DETACH DELETE n
        `);

        console.log("Creating users...");

        await session.run(`
            CREATE
                (:User {
                    id: "u1",
                    name: "Supriya"
                }),
                (:User {
                    id: "u2",
                    name: "Rahul"
                }),
                (:User {
                    id: "u3",
                    name: "Ananya"
                })
        `);

        console.log("Creating skills...");

        await session.run(`
            CREATE
                (:Skill {name: "Java"}),
                (:Skill {name: "SQL"}),
                (:Skill {name: "Git"}),
                (:Skill {name: "Spring Boot"}),
                (:Skill {name: "REST API"}),
                (:Skill {name: "MySQL"}),
                (:Skill {name: "PostgreSQL"}),
                (:Skill {name: "Docker"}),
                (:Skill {name: "Node.js"}),
                (:Skill {name: "AWS"})
        `);

        console.log("Creating companies...");

        await session.run(`
            CREATE
                (:Company {id: "c1", name: "Backend Technologies"}),
                (:Company {id: "c2", name: "CloudWorks"}),
                (:Company {id: "c3", name: "Data Systems"}),
                (:Company {id: "c4", name: "DevSolutions"}),
                (:Company {id: "c5", name: "NextGen Software"})
        `);

        console.log("Creating categories...");

        await session.run(`
            CREATE
                (:Category {name: "Backend Development"}),
                (:Category {name: "Cloud Computing"}),
                (:Category {name: "Database"}),
                (:Category {name: "DevOps"}),
                (:Category {name: "Software Development"})
        `);

        console.log("Creating jobs...");

        await session.run(`
            CREATE
                (:Job {
                    id: "j1",
                    title: "Java Developer",
                    location: "Hyderabad",
                    salary: "6-10 LPA",
                    remote: false
                }),

                (:Job {
                    id: "j2",
                    title: "Spring Boot Developer",
                    location: "Bangalore",
                    salary: "8-14 LPA",
                    remote: true
                }),

                (:Job {
                    id: "j3",
                    title: "Backend Developer",
                    location: "Hyderabad",
                    salary: "6-11 LPA",
                    remote: true
                }),

                (:Job {
                    id: "j4",
                    title: "Cloud Engineer",
                    location: "Bangalore",
                    salary: "10-18 LPA",
                    remote: true
                }),

                (:Job {
                    id: "j5",
                    title: "Database Developer",
                    location: "Pune",
                    salary: "7-12 LPA",
                    remote: true
                }),

                (:Job {
                    id: "j6",
                    title: "DevOps Engineer",
                    location: "Bangalore",
                    salary: "9-16 LPA",
                    remote: true
                }),

                (:Job {
                    id: "j7",
                    title: "Node.js Developer",
                    location: "Bangalore",
                    salary: "6-10 LPA",
                    remote: true
                }),

                (:Job {
                    id: "j12",
                    title: "Software Engineer",
                    location: "Hyderabad",
                    salary: "7-13 LPA",
                    remote: true
                })
        `);

        console.log("Creating user-skill relationships...");

        await session.run(`
            MATCH (u:User {id: "u1"})
            MATCH (java:Skill {name: "Java"})
            MATCH (sql:Skill {name: "SQL"})
            MATCH (git:Skill {name: "Git"})
            MATCH (spring:Skill {name: "Spring Boot"})

            CREATE
                (u)-[:HAS_SKILL]->(java),
                (u)-[:HAS_SKILL]->(sql),
                (u)-[:HAS_SKILL]->(git),
                (u)-[:HAS_SKILL]->(spring)
        `);

        console.log("Creating user-category relationships...");

        await session.run(`
            MATCH (u:User {id: "u1"})
            MATCH (backend:Category {name: "Backend Development"})
            MATCH (software:Category {name: "Software Development"})

            CREATE
                (u)-[:INTERESTED_IN]->(backend),
                (u)-[:INTERESTED_IN]->(software)
        `);

        console.log("Creating job-skill relationships...");

        await session.run(`
            MATCH
                (j1:Job {id: "j1"}),
                (j2:Job {id: "j2"}),
                (j3:Job {id: "j3"}),
                (j4:Job {id: "j4"}),
                (j5:Job {id: "j5"}),
                (j6:Job {id: "j6"}),
                (j7:Job {id: "j7"}),
                (j12:Job {id: "j12"}),

                (java:Skill {name: "Java"}),
                (spring:Skill {name: "Spring Boot"}),
                (rest:Skill {name: "REST API"}),
                (mysql:Skill {name: "MySQL"}),
                (postgres:Skill {name: "PostgreSQL"}),
                (docker:Skill {name: "Docker"}),
                (node:Skill {name: "Node.js"}),
                (aws:Skill {name: "AWS"})

            CREATE
                (j1)-[:REQUIRES]->(java),

                (j2)-[:REQUIRES]->(spring),
                (j2)-[:REQUIRES]->(rest),

                (j3)-[:REQUIRES]->(spring),
                (j3)-[:REQUIRES]->(rest),

                (j4)-[:REQUIRES]->(docker),
                (j4)-[:REQUIRES]->(aws),

                (j5)-[:REQUIRES]->(mysql),
                (j5)-[:REQUIRES]->(postgres),

                (j6)-[:REQUIRES]->(docker),

                (j7)-[:REQUIRES]->(rest),
                (j7)-[:REQUIRES]->(node),

                (j12)-[:REQUIRES]->(java),
                (j12)-[:REQUIRES]->(rest)
        `);

        console.log("Creating job-company relationships...");

        await session.run(`
            MATCH
                (j1:Job {id: "j1"}),
                (j2:Job {id: "j2"}),
                (j3:Job {id: "j3"}),
                (j4:Job {id: "j4"}),
                (j5:Job {id: "j5"}),
                (j6:Job {id: "j6"}),
                (j7:Job {id: "j7"}),
                (j12:Job {id: "j12"}),

                (c1:Company {id: "c1"}),
                (c2:Company {id: "c2"}),
                (c3:Company {id: "c3"}),
                (c4:Company {id: "c4"}),
                (c5:Company {id: "c5"})

            CREATE
                (j1)-[:POSTED_BY]->(c1),
                (j2)-[:POSTED_BY]->(c1),
                (j3)-[:POSTED_BY]->(c1),
                (j4)-[:POSTED_BY]->(c2),
                (j5)-[:POSTED_BY]->(c3),
                (j6)-[:POSTED_BY]->(c4),
                (j7)-[:POSTED_BY]->(c5),
                (j12)-[:POSTED_BY]->(c5)
        `);

        console.log("Creating job-category relationships...");

        await session.run(`
            MATCH
                (j1:Job {id: "j1"}),
                (j2:Job {id: "j2"}),
                (j3:Job {id: "j3"}),
                (j4:Job {id: "j4"}),
                (j5:Job {id: "j5"}),
                (j6:Job {id: "j6"}),
                (j7:Job {id: "j7"}),
                (j12:Job {id: "j12"}),

                (backend:Category {name: "Backend Development"}),
                (cloud:Category {name: "Cloud Computing"}),
                (database:Category {name: "Database"}),
                (devops:Category {name: "DevOps"}),
                (software:Category {name: "Software Development"})

            CREATE
                (j1)-[:BELONGS_TO]->(backend),
                (j2)-[:BELONGS_TO]->(backend),
                (j3)-[:BELONGS_TO]->(backend),
                (j4)-[:BELONGS_TO]->(cloud),
                (j5)-[:BELONGS_TO]->(database),
                (j6)-[:BELONGS_TO]->(devops),
                (j7)-[:BELONGS_TO]->(backend),
                (j12)-[:BELONGS_TO]->(software)
        `);

        console.log("Creating related skill relationships...");

        await session.run(`
            MATCH
                (java:Skill {name: "Java"}),
                (spring:Skill {name: "Spring Boot"}),
                (rest:Skill {name: "REST API"}),
                (sql:Skill {name: "SQL"}),
                (mysql:Skill {name: "MySQL"}),
                (postgres:Skill {name: "PostgreSQL"}),
                (docker:Skill {name: "Docker"}),
                (aws:Skill {name: "AWS"}),
                (node:Skill {name: "Node.js"})

            CREATE
                (java)-[:RELATED_TO]->(spring),
                (java)-[:RELATED_TO]->(rest),
                (sql)-[:RELATED_TO]->(mysql),
                (sql)-[:RELATED_TO]->(postgres),
                (docker)-[:RELATED_TO]->(aws),
                (node)-[:RELATED_TO]->(rest)
        `);

        console.log("CareerGraph database seeded successfully!");

    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await session.close();
        await driver.close();
    }
}

seedDatabase();