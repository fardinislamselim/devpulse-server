import { queryOne } from "../../db";
import type { ICreateIssueBody, IIssue } from "../../utils/type";

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
