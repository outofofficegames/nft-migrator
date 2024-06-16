export async function POST(request: Request) {
  const auth = await request.headers.get('Authorization')
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = await request.json()

  const res = await fetch(
    `https://battle-derby-api-oexyjdos5a-od.a.run.app/account/create-migration-map`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': `${process.env.BATTLE_DERBY_API_KEY}`,
        Authorization: auth
      },
      body: JSON.stringify(parsed)
    }
  )
  const data = await res.json()

  return Response.json(data, { status: res.status })
}
