---
kind: "code"
title: "Airtight"
year: "JUN 2026"
blurb: "An AI-powered simulator that grills presenters with realistic federal panel questions to prepare them for the real presentation"
tags: ["React", "TypeScript", "Tailwind CSS", "FastAPI", "Python", "PostgreSQL", "AWS", "Docker"]
role: "Full Stack Developer"
outcome: "Presented to CTG company employees"
links:
    github: "https://github.com/capitaltg/si26-airtight-ryan"
---

# Overview

Picture pitching a project to a panel of federal experts, with funding on the line. The presentation goes well, then the Q&A starts, and one hard question you didn't prepare for can cost you the bid. You might think to ask your coworkers for help, but they're busy building software and sitting in meetings.

Airtight is an AI-powered Q&A simulator for that moment. I built it during my internship at Capital Technology Group. You rehearse against a panel of 3 evaluators, each with their own expertise, and get a score for every answer.

# How it works

- **Answer**: A panelist asks a question, and you answer out loud or by typing.
- **Evaluate**: Each answer is scored against a fixed rubric, and the panelist reacts to that score.
- **Review**: An after-action report shows every score, the quote it was based on, and where you lost points.

# So you might think... why not a chatbot instead?

- **Persona Anti-drift**: There are 3 fixed personas (a technical evaluator, a contracting officer and a program representative) each have their own priorities, wants and red lines. Questions and reactions stay consistent for the whole session.
- **Deterministic Scoring Engine**: The AI only reads your answer and pulls out direct quotes for what you claimed. Plain code scores it against the rubric, so the same answer always gets the same score, between -2 and +2. Backing a claim with evidence earns points; dodging, stating something false or contradicting yourself costs them.
- **After-action Report**: Every point in the report points back to a quote from your answer, so mistakes are easy to spot and reflect upon.
- **Privacy and Security**: Model runs on AWS Bedrock inside the company account, so answers do not go to third party AI providers. It also runs on AWS GovCloud, following FedRAMP security rules federal work requires.

# What I learned
I learned a lot from this project by using AI tools and prompt engineering to learn backend technologies such as PostgreSQL and AWS. It helped me understand how databases work.

# Failures I overcame
- **AI isn't consistent enough to judge**: Grading with a model alone means the same answer can score differently twice. So the model only pulls quotes from your answer, and plain code does the scoring.

# Result

- Presented to Capital Technology Group employees as a practice tool for real federal proposals
