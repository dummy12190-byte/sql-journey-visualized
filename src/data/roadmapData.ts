export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Resource {
  title: string;
  url: string;
  type: "article" | "video" | "docs" | "tutorial";
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  resources: Resource[];
  children?: string[];
}

export const defaultTopics: RoadmapTopic[] = [
  {
    id: "basics",
    title: "SQL Basics",
    description: "Learn the fundamentals of SQL including what databases are, how relational databases work, and basic SQL syntax.",
    category: "Fundamentals",
    difficulty: "beginner",
    resources: [
      { title: "W3Schools SQL Tutorial", url: "https://www.w3schools.com/sql/", type: "tutorial" },
      { title: "SQL in 100 Seconds", url: "https://www.youtube.com/watch?v=zsjvFFKOm3c", type: "video" },
      { title: "SQLBolt Interactive Tutorial", url: "https://sqlbolt.com/", type: "tutorial" },
    ],
    children: ["data-types", "operators", "select"],
  },
  {
    id: "data-types",
    title: "Data Types",
    description: "Understand SQL data types: INT, VARCHAR, TEXT, DATE, BOOLEAN, FLOAT, DECIMAL, BLOB, and more.",
    category: "Fundamentals",
    difficulty: "beginner",
    resources: [
      { title: "SQL Data Types - W3Schools", url: "https://www.w3schools.com/sql/sql_datatypes.asp", type: "docs" },
      { title: "MySQL Data Types", url: "https://dev.mysql.com/doc/refman/8.0/en/data-types.html", type: "docs" },
    ],
  },
  {
    id: "operators",
    title: "Operators",
    description: "SQL operators including arithmetic (+, -, *, /), comparison (=, <>, <, >), logical (AND, OR, NOT), and special operators (BETWEEN, IN, LIKE, IS NULL).",
    category: "Fundamentals",
    difficulty: "beginner",
    resources: [
      { title: "SQL Operators - W3Schools", url: "https://www.w3schools.com/sql/sql_operators.asp", type: "tutorial" },
    ],
  },
  {
    id: "select",
    title: "SELECT Statement",
    description: "Master the SELECT statement — the foundation of SQL queries. Learn SELECT, FROM, WHERE, ORDER BY, LIMIT, and DISTINCT.",
    category: "Fundamentals",
    difficulty: "beginner",
    resources: [
      { title: "SELECT Statement - MDN", url: "https://developer.mozilla.org/en-US/docs/Web/SQL", type: "docs" },
      { title: "SQL SELECT Tutorial", url: "https://www.w3schools.com/sql/sql_select.asp", type: "tutorial" },
    ],
    children: ["commands"],
  },
  {
    id: "commands",
    title: "SQL Commands",
    description: "Learn DDL (CREATE, ALTER, DROP), DML (INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE), and TCL (COMMIT, ROLLBACK, SAVEPOINT).",
    category: "Commands",
    difficulty: "beginner",
    resources: [
      { title: "SQL Commands Overview", url: "https://www.geeksforgeeks.org/sql-ddl-dml-dcl-tcl-commands/", type: "article" },
      { title: "DDL vs DML vs DCL", url: "https://www.youtube.com/watch?v=example", type: "video" },
    ],
    children: ["aggregate-functions", "grouping"],
  },
  {
    id: "aggregate-functions",
    title: "Aggregate Functions",
    description: "COUNT, SUM, AVG, MIN, MAX — aggregate functions summarize data across rows. Essential for reporting and analytics.",
    category: "Commands",
    difficulty: "beginner",
    resources: [
      { title: "SQL Aggregate Functions", url: "https://www.w3schools.com/sql/sql_aggregate_functions.asp", type: "tutorial" },
    ],
  },
  {
    id: "grouping",
    title: "GROUP BY & HAVING",
    description: "Group rows that share values and filter groups with HAVING. Combine with aggregate functions for powerful analysis.",
    category: "Commands",
    difficulty: "intermediate",
    resources: [
      { title: "GROUP BY Tutorial", url: "https://www.w3schools.com/sql/sql_groupby.asp", type: "tutorial" },
    ],
    children: ["joins"],
  },
  {
    id: "joins",
    title: "Joins",
    description: "Combine rows from two or more tables based on related columns. Types: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, SELF JOIN.",
    category: "Joins & Relations",
    difficulty: "intermediate",
    resources: [
      { title: "Visual SQL Joins", url: "https://joins.spathon.com/", type: "tutorial" },
      { title: "SQL Joins Explained", url: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw", type: "video" },
      { title: "SQL Joins - W3Schools", url: "https://www.w3schools.com/sql/sql_join.asp", type: "tutorial" },
    ],
    children: ["subqueries", "views"],
  },
  {
    id: "subqueries",
    title: "Subqueries",
    description: "Nested queries inside SELECT, FROM, or WHERE clauses. Learn correlated vs non-correlated subqueries, EXISTS, and ANY/ALL.",
    category: "Joins & Relations",
    difficulty: "intermediate",
    resources: [
      { title: "SQL Subqueries", url: "https://www.w3schools.com/sql/sql_subqueries.asp", type: "tutorial" },
    ],
  },
  {
    id: "views",
    title: "Views",
    description: "Virtual tables based on SQL queries. Create reusable, simplified interfaces to complex queries. Learn CREATE VIEW, materialized views.",
    category: "Joins & Relations",
    difficulty: "intermediate",
    resources: [
      { title: "SQL Views", url: "https://www.w3schools.com/sql/sql_view.asp", type: "tutorial" },
    ],
    children: ["indexes"],
  },
  {
    id: "indexes",
    title: "Indexes",
    description: "Speed up data retrieval with indexes. Learn B-tree indexes, hash indexes, composite indexes, covering indexes, and when NOT to index.",
    category: "Performance",
    difficulty: "intermediate",
    resources: [
      { title: "Database Indexing Explained", url: "https://use-the-index-luke.com/", type: "article" },
      { title: "SQL Indexes", url: "https://www.w3schools.com/sql/sql_create_index.asp", type: "tutorial" },
    ],
    children: ["transactions"],
  },
  {
    id: "transactions",
    title: "Transactions",
    description: "ACID properties (Atomicity, Consistency, Isolation, Durability). Learn BEGIN, COMMIT, ROLLBACK, SAVEPOINT, and isolation levels.",
    category: "Data Integrity",
    difficulty: "intermediate",
    resources: [
      { title: "SQL Transactions", url: "https://www.geeksforgeeks.org/sql-transactions/", type: "article" },
      { title: "ACID Properties Explained", url: "https://www.youtube.com/watch?v=example2", type: "video" },
    ],
    children: ["constraints", "normalization"],
  },
  {
    id: "constraints",
    title: "Constraints",
    description: "PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT — enforce data integrity rules at the database level.",
    category: "Data Integrity",
    difficulty: "beginner",
    resources: [
      { title: "SQL Constraints", url: "https://www.w3schools.com/sql/sql_constraints.asp", type: "tutorial" },
    ],
  },
  {
    id: "normalization",
    title: "Normalization",
    description: "Organize tables to reduce redundancy. Learn 1NF, 2NF, 3NF, BCNF, and when to denormalize for performance.",
    category: "Design",
    difficulty: "intermediate",
    resources: [
      { title: "Database Normalization", url: "https://www.geeksforgeeks.org/normal-forms-in-dbms/", type: "article" },
      { title: "Normalization Explained", url: "https://www.youtube.com/watch?v=example3", type: "video" },
    ],
    children: ["advanced-sql"],
  },
  {
    id: "advanced-sql",
    title: "Advanced SQL",
    description: "Window functions (ROW_NUMBER, RANK, LAG, LEAD), CTEs, recursive queries, pivoting, dynamic SQL, and query optimization.",
    category: "Advanced",
    difficulty: "advanced",
    resources: [
      { title: "Window Functions Tutorial", url: "https://mode.com/sql-tutorial/sql-window-functions/", type: "tutorial" },
      { title: "Advanced SQL - YouTube", url: "https://www.youtube.com/watch?v=example4", type: "video" },
    ],
    children: ["stored-procedures", "performance-tuning"],
  },
  {
    id: "stored-procedures",
    title: "Stored Procedures & Functions",
    description: "Write reusable SQL code blocks. Learn CREATE PROCEDURE, parameters, control flow (IF, WHILE, LOOP), and user-defined functions.",
    category: "Advanced",
    difficulty: "advanced",
    resources: [
      { title: "Stored Procedures", url: "https://www.w3schools.com/sql/sql_stored_procedures.asp", type: "tutorial" },
    ],
  },
  {
    id: "performance-tuning",
    title: "Performance Tuning",
    description: "EXPLAIN plans, query optimization, indexing strategies, partitioning, caching, connection pooling, and database profiling.",
    category: "Advanced",
    difficulty: "advanced",
    resources: [
      { title: "SQL Performance Explained", url: "https://use-the-index-luke.com/", type: "article" },
      { title: "Query Optimization Tips", url: "https://www.youtube.com/watch?v=example5", type: "video" },
    ],
  },
];

export interface FlowNodePosition {
  id: string;
  x: number;
  y: number;
}

export const nodePositions: FlowNodePosition[] = [
  { id: "basics", x: 400, y: 0 },
  { id: "data-types", x: 150, y: 120 },
  { id: "operators", x: 400, y: 120 },
  { id: "select", x: 650, y: 120 },
  { id: "commands", x: 400, y: 260 },
  { id: "aggregate-functions", x: 200, y: 380 },
  { id: "grouping", x: 600, y: 380 },
  { id: "joins", x: 400, y: 500 },
  { id: "subqueries", x: 200, y: 620 },
  { id: "views", x: 600, y: 620 },
  { id: "indexes", x: 400, y: 740 },
  { id: "transactions", x: 400, y: 860 },
  { id: "constraints", x: 200, y: 980 },
  { id: "normalization", x: 600, y: 980 },
  { id: "advanced-sql", x: 400, y: 1120 },
  { id: "stored-procedures", x: 200, y: 1260 },
  { id: "performance-tuning", x: 600, y: 1260 },
];

export const edgeDefinitions = [
  { source: "basics", target: "data-types" },
  { source: "basics", target: "operators" },
  { source: "basics", target: "select" },
  { source: "select", target: "commands" },
  { source: "commands", target: "aggregate-functions" },
  { source: "commands", target: "grouping" },
  { source: "grouping", target: "joins" },
  { source: "joins", target: "subqueries" },
  { source: "joins", target: "views" },
  { source: "views", target: "indexes" },
  { source: "indexes", target: "transactions" },
  { source: "transactions", target: "constraints" },
  { source: "transactions", target: "normalization" },
  { source: "normalization", target: "advanced-sql" },
  { source: "advanced-sql", target: "stored-procedures" },
  { source: "advanced-sql", target: "performance-tuning" },
];
