export async function GET(request: Request) {
  const auth = await request.headers.get('Authorization')
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const res = await fetch(
    `https://battle-derby-api-oexyjdos5a-od.a.run.app/account/get-migration-map`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': `${process.env.BATTLE_DERBY_API_KEY}`,
        Authorization: auth
      }
    }
  )
  const data = await res.json()
  return Response.json(data, { status: res.status })
}
