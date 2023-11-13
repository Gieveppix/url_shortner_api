import { FilterQuery, Document } from "mongoose";

type PaginatedPayload<T> = Partial<T> & {
  page?: number;
  perPage?: number;
  userId?: string;
};

type PaginatedResult = {
  results: any;
  total: number;
  page: number | null;
  perPage: number | null;
};

// TODO: Validate the page and per page that they have to be positive and not equal to 0
export async function queryAndPaginateResults<T extends Document>(
  model: any,
  payload: PaginatedPayload<T>,
): Promise<PaginatedResult> {
  const { page, perPage, userId, ...rest } = payload;

  const query: FilterQuery<T> = {};

  Object.entries(rest).forEach(([key, value]) => {
    if (value) {
      query[key as keyof FilterQuery<T>] = { $regex: new RegExp(value as string, "i") };
    }
  });

  if (userId) {
    query['createdBy' as keyof FilterQuery<T>] = userId;
  }

  let results, total;

  total = await model.countDocuments(query, {});

  if (page !== undefined && perPage !== undefined) {
    results = await model.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);
  } else {
    results = await model.find(query);
  }

  return { results, page: Number(page) || null, perPage: Number(perPage) || null, total };
}
