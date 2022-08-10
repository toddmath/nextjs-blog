import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  text: string
}

const handler = (_: NextApiRequest, res: NextApiResponse<Data>): void => {
  res.status(200).json({ text: "Hello" })
}

export default handler
