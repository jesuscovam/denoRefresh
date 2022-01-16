// deno-lint-ignore no-extra-semi
;(() => {
	let socket, reconnectionTimerId

	const requestUrl = `${window.location.origin.replace("http", "ws")}/refresh`

	connect()

	function log(message) {
		console.info("[refresh] ", message)
	}

	function refresh() {
		window.location.reload()
	}

	function connect(callback) {
		if (socket) {
			socket.close()
		}

		socket = new WebSocket(requestUrl)
		socket.addEventListener("open", callback)
		socket.addEventListener("message", (event) => {
			if (event.data === "refresh") {
				log("refreshing")
				clearTimeout(reconnectionTimerId)

				reconnectionTimerId = setTimeout(() => {
					connect(refresh)
				}, 1000)
			}
		})
	}
})()
