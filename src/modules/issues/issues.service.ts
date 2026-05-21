import { StatusCodes } from "http-status-codes";
import { queryOne, queryRows } from "../../db";
import type {
  ICreateIssueBody,
  IIssue,
  IIssueQueryParams,
  IIssueWithReporter,
  IReporterInfo,
  IUpdateIssueBody,
  IUserPayload,
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

export const updateIssueService = async (
  issueId: number,
  body: Partial<IUpdateIssueBody>,
  user: IUserPayload,
): Promise<IIssue> => {
  // Find issue
  const issue = await queryOne<IIssue>(
    `SELECT *
     FROM issues
     WHERE id = $1`,
    [issueId],
  );

  // Not found
  if (!issue) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: "Issue not found.",
    };
  }

  // Permission checks
  if (user.role === "contributor") {
    // Only own issue
    if (issue.reporter_id !== user.id) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: "You can only edit your own issues.",
      };
    }

    // Only open issue
    if (issue.status !== "open") {
      throw {
        statusCode: StatusCodes.CONFLICT,
        message: "Contributors can only edit issues that are still open.",
      };
    }
  }

  // Dynamic SET clause
  const setClauses: string[] = [];

  const params: unknown[] = [];

  // Title
  if (body.title !== undefined) {
    params.push(body.title.trim());

    setClauses.push(`title = $${params.length}`);
  }

  // Description
  if (body.description !== undefined) {
    params.push(body.description.trim());

    setClauses.push(`description = $${params.length}`);
  }

  // Type
  if (body.type !== undefined) {
    params.push(body.type);

    setClauses.push(`type = $${params.length}`);
  }

  // Only maintainer can update status
  if (body.status !== undefined && user.role === "maintainer") {
    params.push(body.status);

    setClauses.push(`status = $${params.length}`);
  }

  // No valid fields
  if (setClauses.length === 0) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "No valid fields provided for update.",
    };
  }

  // Always update timestamp
  setClauses.push(`updated_at = NOW()`);

  // WHERE id
  params.push(issueId);

  // Update query
  const updated = await queryOne<IIssue>(
    `UPDATE issues
     SET ${setClauses.join(", ")}
     WHERE id = $${params.length}
     RETURNING *`,
    params,
  );

  if (!updated) {
    throw {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to update issue.",
    };
  }

  return updated;
};