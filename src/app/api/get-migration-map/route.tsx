export async function GET(request: Request) {
  const auth = await request.headers.get('Authorization')
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/account/get-migration-map`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': `${process.env.BATTLE_DERBY_API_KEY}`,
        Authorization: auth
      },
      next: { revalidate: 0 }
    }
  )
  const data = await res.json()
  return Response.json(data, { status: res.status })
}
