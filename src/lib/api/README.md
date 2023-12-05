Files in here are loaded in by the server-side portion of the SvelteKit app.

API calls to from the client-side SvelteKit code is provied by the server where it is enriched with the session data and signed to pass checks in the Worker code which actually handles the request.
