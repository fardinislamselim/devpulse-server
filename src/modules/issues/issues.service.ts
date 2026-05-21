import { queryOne, queryRows } from "../../db";
import type {
  ICreateIssueBody,
  IIssue,
  IIssueQueryParams,
  IIssueWithReporter,
  IReporterInfo,
} from "../../utils/type";

export const createIssueService = async (
  payload: ICreateIssueBody,
  reporterId: number,
): Promise<IIssue | null> => {
  const { title, description, type } = payload;

  const issue = await queryOne<IIssue>(
    `INSERT INTO issues (
      title,
      description,
      type,
      reporter_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [title.trim(), description.trim(), type, reporterId],
  );

  return issue;
};

const attachReporters = async (
  issues: IIssue[],
): Promise<IIssueWithReporter[]> => {
  if (issues.length === 0) {
    return [];
  }

  // Unique reporter IDs
  const ids = [...new Set(issues.map((issue) => issue.reporter_id))];

  // SQL placeholders
  const placeholders = ids.map((_, idx) => `$${idx + 1}`).join(", ");

  // Fetch reporters
  const reporters = await queryRows<IReporterInfo>(
    `SELECT id, name, role
     FROM users
     WHERE id IN (${placeholders})`,
    ids,
  );

  // Create lookup map
  const reporterMap = new Map(
    reporters.map((reporter) => [reporter.id, reporter]),
  );

  // Attach reporter to issue
  return issues.map(({ reporter_id, ...rest }) => ({
    ...rest,
    reporter: reporterMap.get(reporter_id) ?? {
      id: reporter_id,
      name: "Unknown",
      role: "contributor",
    },
  }));
};

export const getAllIssuesService = async (
  query: IIssueQueryParams,
): Promise<IIssueWithReporter[]> => {
  const { sort = "newest", type, status } = query;

  // Dynamic WHERE
  const conditions: string[] = [];

  const params: unknown[] = [];

  // Filter by type
  if (type) {
    params.push(type);

    conditions.push(`type = $${params.length}`);
  }

  // Filter by status
  if (status) {
    params.push(status);

    conditions.push(`status = $${params.length}`);
  }

  // WHERE clause
  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Sorting
  const order = sort === "oldest" ? "ASC" : "DESC";

  // Fetch issues
  const issues = await queryRows<IIssue>(
    `SELECT *
     FROM issues
     ${where}
     ORDER BY created_at ${order}`,
    params,
  );

  // Attach reporter info
  return await attachReporters(issues);
};

const getReporter = async (
  reporterId: number,
): Promise<IReporterInfo | null> => {
  return await queryOne<IReporterInfo>(
    `SELECT id, name, role
     FROM users
     WHERE id = $1`,
    [reporterId],
  );
};

export const getIssueByIdService = async (
  id: string,
): Promise<IIssueWithReporter | null> => {
  // Fetch issue
  const issue = await queryOne<IIssue>(
    `SELECT *
     FROM issues
     WHERE id = $1`,
    [id],
  );

  if (!issue) {
    return null;
  }

  // Fetch reporter
  const reporter = await getReporter(issue.reporter_id);

  // Remove reporter_id
  const { reporter_id, ...rest } = issue;

  // Final response shape
  return {
    ...rest,
    reporter: reporter ?? {
      id: reporter_id,
      name: "Unknown",
      role: "contributor",
    },
  };
};