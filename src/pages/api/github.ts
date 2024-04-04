// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type TrackingData = {
  headers: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrackingData>,
) {
  res.status(200).json({ headers: JSON.stringify(req.headers) });
}