# ScholarEdge Question Library Expansion Plan

## Goal

Grow the approved practice library to at least 5,000 high-quality, original questions without copying official, paid, or third-party exam material.

All generated questions should use official/public pages only for structure, timing, section names, skills assessed and difficulty style. Prompts, passages, numbers, contexts, answer options and explanations must be original.

## Target Distribution

| Area | Target Questions | Notes |
| --- | ---: | --- |
| NAPLAN | 1,000 | Years 3, 5, 7, 9 across numeracy, reading, writing and conventions |
| ICAS | 900 | English, mathematics, science and writing across Years 3-10 first, then senior extension |
| NSW Selective | 700 | Reading, mathematical reasoning, thinking skills and writing for Years 5-6 |
| VIC Selective / ACER | 650 | Mathematics, quantitative reasoning, reading, verbal reasoning and writing for Years 8-9 |
| ACER Scholarship | 550 | Humanities/source interpretation, mathematics, reasoning and writing for Years 6-10 |
| EduTest | 550 | Verbal reasoning, numerical reasoning, reading and mathematics for Years 4-10 |
| VCE / HSC Skills | 450 | Senior English unseen text, argument analysis, text response and analytical writing |
| General Science Inquiry | 200 | Cross-pathway science reasoning and investigation skills |

Total target: 5,000.

## Generation Workflow

1. Use the admin AI Question Generator.
2. Select one exam pathway, subject, year level and difficulty at a time.
3. Generate in batches of 25, or use batch target mode for up to 250 questions per run.
4. Review generated questions before publishing where possible.
5. Save as draft for bulk review, or approve only when the batch has been checked.
6. Use the admin question list filters to inspect each exam/subject/year bucket after saving.

## Quality Rules

- Exactly four answer options.
- Exactly one correct answer.
- Explanation must teach the reasoning.
- Avoid repeated stems, near-identical contexts, duplicated answer options and repeated correct-answer patterns.
- Use Australian English.
- Use public source links only as format guidance.
- Keep questions self-contained unless the passage/table is included inside the question.
- For reading and senior English, use original short passages only.
- For writing, prefer multiple-choice questions about planning, structure, audience, expression, editing and analysis.

## Recommended Batch Order

Start with under-represented high-demand pathways:

1. Selective reasoning and mathematical reasoning, Years 5-6.
2. Scholarship verbal and numerical reasoning, Years 5-8.
3. ICAS science and maths, Years 4-8.
4. NAPLAN conventions and reading, Years 3, 5, 7, 9.
5. Senior English skills, Years 11-12.

## Operational Notes

- The edge generator now supports up to 25 questions per function call.
- The admin UI batch target mode loops multiple calls and deduplicates question stems in the current run.
- The save function already inserts in chunks of 500, so saving is not the bottleneck.
- For very large production expansions, generate in 100-250 question runs, then review and publish by bucket.
- Keep migrations/seed packs idempotent with stable `legacy_id` values and `ON CONFLICT DO NOTHING`.
