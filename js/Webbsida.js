let depression_percent = await dbQuery(`Degree,
  COUNT(CASE WHEN Depression = 0 THEN 1 END) AS count_noDep,
  ROUND(COUNT(CASE WHEN Depression = 0 THEN 1 END) * 100.0 / COUNT(*)) AS p_noDep,
  COUNT(CASE WHEN Depression = 1 THEN 1 END) AS count_withDep,
  ROUND(COUNT(CASE WHEN Depression = 1 THEN 1 END) * 100.0 / COUNT(*)) AS p_withDep
FROM 
    Study_India
WHERE 
    Age <= 34 AND Degree != 'Others'
GROUP BY 
    Degree
  `)