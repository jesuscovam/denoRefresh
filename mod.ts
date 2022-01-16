async function watch() {
	const watcher = Deno.watchFs("./")

	for await (const event of watcher) {
		if (["any", "access"].includes(event.kind)) {
			continue
		}

		sockets.forEach((socket) => {
			socket.send("refresh")
		})
	}
}

const sockets: Set<WebSocket> = new Set()

function refreshMiddleware(req: Request): Response | null {
	if (req.url.endsWith("/refresh")) {
		const { response, socket } = Deno.upgradeWebSocket(req)

		sockets.add(socket)

		socket.onclose = () => {
			sockets.delete(socket)
		}

		return response
	}

	return null
}

export function refresh(): (req: Request) => Response | null {
	watch()

	return refreshMiddleware
}
