import { serve } from "https://deno.land/std/http/server.ts"
import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts"
import { refresh } from "./mod.ts"

// Create useful file path variables for our code
const __dirname = fromFileUrl(dirname(import.meta.url))
const clientFilePath = join(__dirname, "./client.js")
const indexFilePath = join(__dirname, "./index.html")

const refreshMiddleware = refresh()

serve((req: Request) => {
	const res = refreshMiddleware(req)

	if (res) return res

	if (req.url.endsWith("client.js")) {
		const client = Deno.readTextFileSync(clientFilePath)

		return new Response(client, {
			headers: {
				"Content-Type": "application/javascript",
			},
		})
	}

	const index = Deno.readFileSync(indexFilePath)

	return new Response(index, {
		headers: { "Content-Type": "text/html" },
	})
})

console.log("Listening on http://localhost:8000")
