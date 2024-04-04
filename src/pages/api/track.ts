// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { IncomingHttpHeaders } from 'http';

type TrackingData = {
    headers: IncomingHttpHeaders;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<TrackingData>,
) {
    console.log(req.headers);
    console.log(`/api/track`);
    res.status(200).json({
        headers: req.headers
    });
}