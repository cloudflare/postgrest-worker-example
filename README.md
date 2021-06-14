# postgrest-worker-example

Deploy a serverless API for interfacing with a PostgreSQL database, via PostgREST.

## Setup

Fork/clone this repository and install the relevant dependencies:

```sh
$ git clone https://github.com/signalnerve/postgrest-worker-example
```

Publish the project to your workers.dev domain using `wrangler publish`:

```sh
$ wrangler publish
Successfully published your script to https://postgrest-worker-example.signalnerve.workers.dev
```

## Configuration

After publishing `wrangler publish`, set the `POSTGREST_ENDPOINT` to configure the Workers function to make requests to your database. This PostgREST endpoint should be available to the internet (though you can secure it with tools like [Cloudflare Access](https://cloudflare.com/teams/access)).

```sh
$ wrangler secret put POSTGREST_ENDPOINT
```

If you haven't set up PostgreSQL + PostgREST yet, you can deploy a local instance using [postgres-postgrest-cloudflared-example](http://github.com/signalnerve/postgres-postgrest-cloudflared-example).

## Example endpoints

This example codebase sets up a few endpoints for you to play with, to understand how to use PostgREST (and [postgrest-js](https://github.com/supabase/postgrest-js)) inside of a Workers function:

| Endpoint     | Method | What it does       |
| ------------ | ------ | ------------------ |
| `/users`     | `GET`  | List users         |
| `/users/:id` | `GET`  | Get a user by ID   |
| `/users/`    | `POST` | Create a new user* |

_*_: You can create a new user by posting a JSON payload, for instance `{"name": "Kristian"}`, where the keys match your column names.

## Authentication warning

This repository, as well as the corresponding [postgres-postgrest-cloudflared-example](http://github.com/signalnerve/postgres-postgrest-cloudflared-example) repository, do not contain any authentication by default. You should read through PostgREST's [authentication guide](https://postgrest.org/en/stable/tutorials/tut1.html) to learn how to correctly configure authentication for your PostgREST endpoint. Once you've done this, you can pass authentication inside of this function by configuring the PostgREST `client` variable with a custom header, as seen below:

```js
const client = new PostgrestClient(POSTGREST_ENDPOINT, {
  headers: {
    Authentication: `Bearer ${AUTH_TOKEN}`
  }
})
```

It's _highly_ recommended that you set this `AUTH_TOKEN` value using Wrangler's `secret` feature, similar to `POSTGREST_ENDPOINT` earlier:

```sh
$ wrangler secret put AUTH_TOKEN
```