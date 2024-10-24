import type { NextApiRequest, NextApiResponse } from "next";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const options = {method: 'GET'};
        const data = await (await fetch('https://webapi.shohoz.com/v1.0/web/auth/sign-in', options)).json();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(403).json({error: (error as Error).message});
    }
}


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    if (req.method === 'GET')
      return GET(req, res);
    res.status(404).json({error: 'Invalid Method'}); 
  }
  