// server/src/middlewares/logParamsAndQueries.ts
import type { NextFunction, Request, Response } from "express"
import debug from "debug"

debug.enable("express:params-queries")
const log = debug("express:params-queries")

const logParamsAndQueries = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	log(`Params: ${JSON.stringify(req.params)}`)
	log(`Queries: ${JSON.stringify(req.query)}`)
	log(`Body: ${JSON.stringify(req.body)}`)
	next()
}

export default logParamsAndQueries
