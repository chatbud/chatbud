// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  auth: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body);
  if (req.body === 'Developer at Shopify') {
    res.status(200).json({ auth: true });
    return;
  }
  res.status(401).json({ auth: false });
}
