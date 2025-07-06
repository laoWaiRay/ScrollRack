export async function POST(request: Request) {
	const { accessToken, refreshToken } = await request.json();

	return new Response(null, {
		status: 200,
		headers: {
			"Set-Cookie": `access_token=${accessToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; Secure, refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax; Secure`,
		},
	});
}
