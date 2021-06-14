import { PostgrestClient } from '@supabase/postgrest-js'
import { Router } from 'itty-router'

const router = Router()
const client = new PostgrestClient(POSTGREST_ENDPOINT)

addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request))
})

router.get('/users', async () => {
  const { data: users, error } = await client.from('users').select()
  if (error) throw error

  return new Response(JSON.stringify({ users }), {
    headers: { 'content-type': 'application/json' },
  })
})

router.get('/users/:id', async ({ params }) => {
  const { id } = params
  const { data, error } = await client
    .from('users')
    .select()
    .eq('id', id)
    .limit(1)

  if (error) throw error

  const user = data.length ? data[0] : null

  return new Response(JSON.stringify({ user }), {
    headers: { 'content-type': 'application/json' },
  })
})

router.post('/users', async request => {
  const userData = await request.json()
  const { data: user, error } = await client
    .from('users')
    .insert([userData])

  if (error) throw error

  return new Response(JSON.stringify({ user }), {
    headers: { 'content-type': 'application/json' },
  })
})

router.all('*', () => new Response("Not Found", { status: 404 }))