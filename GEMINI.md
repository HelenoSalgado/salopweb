## Documentação

### Sobre o uso do useFecth

useAsyncData and useFetch return the same object type and accept a common set of options as their last argument. They can help you control the composables behavior, such as navigation blocking, caching or execution.

Lazy
By default, data fetching composables will wait for the resolution of their asynchronous function before navigating to a new page by using Vue's Suspense. This feature can be ignored on client-side navigation with the lazy option. In that case, you will have to manually handle loading state using the status value.

app/app.vue

<script setup lang="ts">
const { status, data: posts } = useFetch('/api/posts', {
  lazy: true,
})
</script>

<template>
  <!-- you will need to handle a loading state -->
  <div v-if="status === 'pending'">
    Loading ...
  </div>
  <div v-else>
    <div v-for="post in posts">
      <!-- do something -->
    </div>
  </div>
</template>
You can alternatively use useLazyFetch and useLazyAsyncData as convenient methods to perform the same.


<script setup lang="ts">
const { status, data: posts } = useLazyFetch('/api/posts')
</script>
Read more about useLazyFetch.
Read more about useLazyAsyncData.

Watch a video from Vue School on blocking vs. non-blocking (lazy) requests
Client-only fetching
By default, data fetching composables will perform their asynchronous function on both client and server environments. Set the server option to false to only perform the call on the client-side. On initial load, the data will not be fetched before hydration is complete so you have to handle a pending state, though on subsequent client-side navigation the data will be awaited before loading the page.

Combined with the lazy option, this can be useful for data that is not needed on the first render (for example, non-SEO sensitive data).


/* This call is performed before hydration */
const articles = await useFetch('/api/article')

/* This call will only be performed on the client */
const { status, data: comments } = useFetch('/api/comments', {
  lazy: true,
  server: false,
})
The useFetch composable is meant to be invoked in setup method or called directly at the top level of a function in lifecycle hooks, otherwise you should use $fetch method.

Minimize payload size
The pick option helps you to minimize the payload size stored in your HTML document by only selecting the fields that you want returned from the composables.


<script setup lang="ts">
/* only pick the fields used in your template */
const { data: mountain } = await useFetch('/api/mountains/everest', {
  pick: ['title', 'description'],
})
</script>

<template>
  <h1>{{ mountain.title }}</h1>
  <p>{{ mountain.description }}</p>
</template>
If you need more control or map over several objects, you can use the transform function to alter the result of the query.


const { data: mountains } = await useFetch('/api/mountains', {
  transform: (mountains) => {
    return mountains.map(mountain => ({ title: mountain.title, description: mountain.description }))
  },
})
Both pick and transform don't prevent the unwanted data from being fetched initially. But they will prevent unwanted data from being added to the payload transferred from server to client.

Watch a video from Vue School on minimizing payload size
Caching and refetching
Keys
useFetch and useAsyncData use keys to prevent refetching the same data.

useFetch uses the provided URL as a key. Alternatively, a key value can be provided in the options object passed as a last argument.
useAsyncData uses its first argument as a key if it is a string. If the first argument is the handler function that performs the query, then a key that is unique to the file name and line number of the instance of useAsyncData will be generated for you.
To get the cached data by key, you can use useNuxtData

Watch a video from Vue School on caching data with the key option
Shared State and Option Consistency
When multiple components use the same key with useAsyncData or useFetch, they will share the same data, error and status refs. This ensures consistency across components but requires some options to be consistent.

The following options must be consistent across all calls with the same key:

handler function
deep option
transform function
pick array
getCachedData function
default value

// ❌ This will trigger a development warning
const { data: users1 } = useAsyncData('users', () => $fetch('/api/users'), { deep: false })
const { data: users2 } = useAsyncData('users', () => $fetch('/api/users'), { deep: true })
The following options can safely differ without triggering warnings:

server
lazy
immediate
dedupe
watch

// ✅ This is allowed
const { data: users1 } = useAsyncData('users', () => $fetch('/api/users'), { immediate: true })
const { data: users2 } = useAsyncData('users', () => $fetch('/api/users'), { immediate: false })
If you need independent instances, use different keys:


// These are completely independent instances
const { data: users1 } = useAsyncData('users-1', () => $fetch('/api/users'))
const { data: users2 } = useAsyncData('users-2', () => $fetch('/api/users'))
Reactive Keys
You can use computed refs, plain refs or getter functions as keys, allowing for dynamic data fetching that automatically updates when dependencies change:


// Using a computed property as a key
const userId = ref('123')
const { data: user } = useAsyncData(
  computed(() => `user-${userId.value}`),
  () => fetchUser(userId.value),
)

// When userId changes, the data will be automatically refetched
// and the old data will be cleaned up if no other components use it
userId.value = '456'
Refresh and execute
If you want to fetch or refresh data manually, use the execute or refresh function provided by the composables.


<script setup lang="ts">
const { data, error, execute, refresh } = await useFetch('/api/users')
</script>

<template>
  <div>
    <p>{{ data }}</p>
    <button @click="() => refresh()">
      Refresh data
    </button>
  </div>
</template>
The execute function is an alias for refresh that works in exactly the same way but is more semantic for cases when the fetch is not immediate.

To globally refetch or invalidate cached data, see clearNuxtData and refreshNuxtData.
Clear
If you want to clear the data provided, for whatever reason, without needing to know the specific key to pass to clearNuxtData, you can use the clear function provided by the composables.


<script setup lang="ts">
const { data, clear } = await useFetch('/api/users')

const route = useRoute()
watch(() => route.path, (path) => {
  if (path === '/') {
    clear()
  }
})
</script>
Watch
To re-run your fetching function each time other reactive values in your application change, use the watch option. You can use it for one or multiple watchable elements.


<script setup lang="ts">
const id = ref(1)

const { data, error, refresh } = await useFetch('/api/users', {
  /* Changing the id will trigger a refetch */
  watch: [id],
})
</script>
Note that watching a reactive value won't change the URL fetched. For example, this will keep fetching the same initial ID of the user because the URL is constructed at the moment the function is invoked.


<script setup lang="ts">
const id = ref(1)

const { data, error, refresh } = await useFetch(`/api/users/${id.value}`, {
  watch: [id],
})
</script>
If you need to change the URL based on a reactive value, you may want to use a computed URL instead.

When reactive fetch options are provided, they'll be automatically watched and trigger refetches. In some cases, it can be useful to opt-out of this behavior by specifying watch: false.


const id = ref(1)

// Won't automatically refetch when id changes
const { data, execute } = await useFetch('/api/users', {
  query: { id }, // id is watched by default
  watch: false, // disables automatic watching of id
})

// doesn't trigger refetch
id.value = 2
Computed URL
Sometimes you may need to compute a URL from reactive values, and refresh the data each time these change. Instead of juggling your way around, you can attach each param as a reactive value. Nuxt will automatically use the reactive value and re-fetch each time it changes.


<script setup lang="ts">
const id = ref(null)

const { data, status } = useLazyFetch('/api/user', {
  query: {
    user_id: id,
  },
})
</script>
In the case of more complex URL construction, you may use a callback as a computed getter that returns the URL string.

Every time a dependency changes, the data will be fetched using the newly constructed URL. Combine this with not-immediate, and you can wait until the reactive element changes before fetching.


<script setup lang="ts">
const id = ref(null)

const { data, status } = useLazyFetch(() => `/api/users/${id.value}`, {
  immediate: false,
})

const pending = computed(() => status.value === 'pending')
</script>

<template>
  <div>
    <!-- disable the input while fetching -->
    <input
      v-model="id"
      type="number"
      :disabled="pending"
    >

    <div v-if="status === 'idle'">
      Type an user ID
    </div>

    <div v-else-if="pending">
      Loading ...
    </div>

    <div v-else>
      {{ data }}
    </div>
  </div>
</template>
If you need to force a refresh when other reactive values change, you can also watch other values.

Not immediate
The useFetch composable will start fetching data the moment is invoked. You may prevent this by setting immediate: false, for example, to wait for user interaction.

With that, you will need both the status to handle the fetch lifecycle, and execute to start the data fetch.


<script setup lang="ts">
const { data, error, execute, status } = await useLazyFetch('/api/comments', {
  immediate: false,
})
</script>

<template>
  <div v-if="status === 'idle'">
    <button @click="execute">
      Get data
    </button>
  </div>

  <div v-else-if="status === 'pending'">
    Loading comments...
  </div>

  <div v-else>
    {{ data }}
  </div>
</template>
For finer control, the status variable can be:

idle when the fetch hasn't started
pending when a fetch has started but not yet completed
error when the fetch fails
success when the fetch is completed successfully
Passing Headers and Cookies
When we call $fetch in the browser, user headers like cookie will be directly sent to the API.

Normally, during server-side-rendering, due to security considerations, the $fetch wouldn't include the user's browser cookies, nor pass on cookies from the fetch response.

However, when calling useFetch with a relative URL on the server, Nuxt will use useRequestFetch to proxy headers and cookies (with the exception of headers not meant to be forwarded, like host).

Pass Cookies From Server-side API Calls on SSR Response
If you want to pass on/proxy cookies in the other direction, from an internal request back to the client, you will need to handle this yourself.

app/composables/fetch.ts

import { appendResponseHeader } from 'h3'
import type { H3Event } from 'h3'

export const fetchWithCookie = async (event: H3Event, url: string) => {
  /* Get the response from the server endpoint */
  const res = await $fetch.raw(url)
  /* Get the cookies from the response */
  const cookies = res.headers.getSetCookie()
  /* Attach each cookie to our incoming Request */
  for (const cookie of cookies) {
    appendResponseHeader(event, 'set-cookie', cookie)
  }
  /* Return the data of the response */
  return res._data
}

<script setup lang="ts">
// This composable will automatically pass cookies to the client
const event = useRequestEvent()

const { data: result } = await useAsyncData(() => fetchWithCookie(event!, '/api/with-cookie'))

onMounted(() => console.log(document.cookie))
</script>
Options API Support
Nuxt provides a way to perform asyncData fetching within the Options API. You must wrap your component definition within defineNuxtComponent for this to work.


<script>
export default defineNuxtComponent({
  /* Use the fetchKey option to provide a unique key */
  fetchKey: 'hello',
  async asyncData () {
    return {
      hello: await $fetch('/api/hello'),
    }
  },
})
</script>
Using <script setup> or <script setup lang="ts"> are the recommended way of declaring Vue components in Nuxt.
 Read more in Docs > 4 X > API > Utils > Define Nuxt Component.
Serializing Data From Server to Client
When using useAsyncData and useLazyAsyncData to transfer data fetched on server to the client (as well as anything else that utilizes the Nuxt payload), the payload is serialized with devalue. This allows us to transfer not just basic JSON but also to serialize and revive/deserialize more advanced kinds of data, such as regular expressions, Dates, Map and Set, ref, reactive, shallowRef, shallowReactive and NuxtError - and more.

It is also possible to define your own serializer/deserializer for types that are not supported by Nuxt. You can read more in the useNuxtApp docs.

Note that this does not apply to data passed from your server routes when fetched with $fetch or useFetch - see the next section for more information.
Serializing Data From API Routes
When fetching data from the server directory, the response is serialized using JSON.stringify. However, since serialization is limited to only JavaScript primitive types, Nuxt does its best to convert the return type of $fetch and useFetch to match the actual value.

Learn more about JSON.stringify limitations.
Example
server/api/foo.ts

export default defineEventHandler(() => {
  return new Date()
})
app/app.vue

<script setup lang="ts">
// Type of `data` is inferred as string even though we returned a Date object
const { data } = await useFetch('/api/foo')
</script>
Custom serializer function
To customize the serialization behavior, you can define a toJSON function on your returned object. If you define a toJSON method, Nuxt will respect the return type of the function and will not try to convert the types.

server/api/bar.ts

export default defineEventHandler(() => {
  const data = {
    createdAt: new Date(),

    toJSON () {
      return {
        createdAt: {
          year: this.createdAt.getFullYear(),
          month: this.createdAt.getMonth(),
          day: this.createdAt.getDate(),
        },
      }
    },
  }
  return data
})
app/app.vue

<script setup lang="ts">
// Type of `data` is inferred as
// {
//   createdAt: {
//     year: number
//     month: number
//     day: number
//   }
// }
const { data } = await useFetch('/api/bar')
</script>
Using an alternative serializer
Nuxt does not currently support an alternative serializer to JSON.stringify. However, you can return your payload as a normal string and utilize the toJSON method to maintain type safety.

In the example below, we use superjson as our serializer.

server/api/superjson.ts

import superjson from 'superjson'

export default defineEventHandler(() => {
  const data = {
    createdAt: new Date(),

    // Workaround the type conversion
    toJSON () {
      return this
    },
  }

  // Serialize the output to string, using superjson
  return superjson.stringify(data) as unknown as typeof data
})
app/app.vue

<script setup lang="ts">
import superjson from 'superjson'

// `date` is inferred as { createdAt: Date } and you can safely use the Date object methods
const { data } = await useFetch('/api/superjson', {
  transform: (value) => {
    return superjson.parse(value as unknown as string)
  },
})
</script>
Recipes
Consuming SSE (Server-Sent Events) via POST request
If you're consuming SSE via GET request, you can use EventSource or VueUse composable useEventSource.
When consuming SSE via POST request, you need to handle the connection manually. Here's how you can do it:


// Make a POST request to the SSE endpoint
const response = await $fetch<ReadableStream>('/chats/ask-ai', {
  method: 'POST',
  body: {
    query: 'Hello AI, how are you?',
  },
  responseType: 'stream',
})

// Create a new ReadableStream from the response with TextDecoderStream to get the data as text
const reader = response.pipeThrough(new TextDecoderStream()).getReader()

// Read the chunk of data as we get it
while (true) {
  const { value, done } = await reader.read()

  if (done) { break }

  console.log('Received:', value)
}
Making parallel requests
When requests don't rely on each other, you can make them in parallel with Promise.all() to boost performance.


const { data } = await useAsyncData(() => {
  return Promise.all([
    $fetch('/api/comments/'),
    $fetch('/api/author/12'),
  ])
})

const comments = computed(() => data.value?.[0])
const author = computed(() => data.value?.[1])

### Sobre o uso do queryCollection

Installation

Copy page

Get started with Nuxt Content v3 in your Nuxt application.
Install the Package
Choose your preferred package manager to install Nuxt Content v3:


pnpm

yarn

npm

bun

pnpm add @nuxt/content
Register the Module
Add the Nuxt Content module to your nuxt.config.ts:

nuxt.config.ts

export default defineNuxtConfig({
  modules: ['@nuxt/content']
})
Automatic Setup
When starting a new Nuxt project with the create-nuxt CLI, you can simply select @nuxt/content from the interactive module selector. This will automatically install and register the module for you.


npm

yarn

pnpm

bun

deno

npm create nuxt <project-name>
When you run your project in Node.js, Nuxt Content will ask you about the database connector to use. You can choose to install better-sqlite3 or sqlite3 package.
If you don't want to install any package, you can use native SQLite from Node.js@v22.5.0 or newer. Checkout experimental.nativeSqlite configuration.
Create your First Collection
Create a content.config.ts file in your project root directory:

content.config.ts

import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    })
  }
})
This configuration creates a default content collection that processes all Markdown files located in the content folder of your project. You can customize the collection settings based on your needs.

The type: page means there is a 1-to-1 relationship between content files and pages on your site.
Learn more in our Collections guide.
Create your First Markdown Page
Create a content/index.md file in your project root directory:

content/index.md

# My First Page

Here is some content.
Read more about writing Markdown pages.

Display your Page
Create a pages/index.vue file and display the page content:

pages/index.vue

<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
</script>

<template>
  <ContentRenderer v-if="home" :value="home" />
  <div v-else>Home not found</div>
</template>
If you are installing Nuxt Content in a new Nuxt project and you didn't have pages directory, you also need to update the app.vue file to allow rendering the pages by adding the NuxtPage component. (If you already have some pages in your project, you are good to go.)
app.vue

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

### Uso e configuração principal do queryCollection

queryCollection

Copy page

The queryCollection composable provides methods for querying and fetching your collections.
Usage
Use the auto-imported queryCollection to find contents inside a collection. Here we assume that you have defined docs collection inside content.config.ts.

If you have not defined any collection, check How to define a collection.

pages/[...slug].vue

<script>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})
</script>
The queryCollection utility is available in both Vue and Nitro. Checkout Server Usage for more details on how to use it on the server side.
API
Type

function queryCollection<T extends keyof Collections>(collection: T): CollectionQueryBuilder<Collections[T]>

interface CollectionQueryBuilder<T> {
  where(field: keyof T | string, operator: SQLOperator, value?: unknown): CollectionQueryBuilder<T>
  andWhere(groupFactory: QueryGroupFunction<T>): CollectionQueryBuilder<T>
  orWhere(groupFactory: QueryGroupFunction<T>): CollectionQueryBuilder<T>
  order(field: keyof T, direction: 'ASC' | 'DESC'): CollectionQueryBuilder<T>
  // ... other methods
}
queryCollection(collection: CollectionName)
Create a query builder to search in the specific collection.

Parameter:
collection: The key of defined collection in content.config.ts
path(path: string)
Search for contents that have specific path. (path is an special field in page collections which generates based on fs path and can be use as route to render the content)

Parameter:
path: The path string to match.

const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})
select(...fields: keyof Collection)
Select specific fields from the collection to be returned in the query result.

Parameters:
...fields: A list of field names to select from the collection.

const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .select('path', 'title', 'description')
    .first()
})
where(field: keyof Collection | string, operator: SqlOperator, value?: unknown)
Add a condition to the query to filter results based on a specific field.

Parameters:
field: The field to filter on
operator: The SQL operator to use for comparison. Possible values include:
'=': Equal to
'>': Greater than
'<': Less than
'<>': Not equal to
'IN': In a list of values
'BETWEEN': Between two values
'NOT BETWEEN': Not between two values
'IS NULL': Is null
'IS NOT NULL': Is not null
'LIKE': Matches a pattern
'NOT LIKE': Does not match a pattern
value: The value to compare against. The type depends on the operator used.

const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .where('date', '<', '2024-04-04')
    .where('category', '=', 'news')
    .all()
})

// Generated SQL
// SELECT * FROM docs WHERE date < '2024-04-04' AND category = 'news'
andWhere(groupFactory: QueryGroupFunction<Collection>)
Add an AND condition group to the query. This allows for more complex query conditions.

Parameter:
groupFactory: A function that receives a query builder and can add multiple conditions that will be grouped together with AND

const { data } = await useAsyncData('recent-docs', () => {
  return queryCollection('docs')
    .where('published', '=', true)
    .andWhere(query => query.where('date', '>', '2024-01-01').where('category', '=', 'news'))
    .all()
})

// Generated SQL
// SELECT * FROM docs WHERE published = true AND (date > '2024-01-01' AND category = 'news')
orWhere(groupFactory: QueryGroupFunction<Collection>)
Add an OR condition group to the query. This allows for alternative conditions.

Parameter:
groupFactory: A function that receives a query builder and can add multiple conditions that will be grouped together with OR

const { data } = await useAsyncData('featured-docs', () => {
  return queryCollection('docs')
    .where('published', '=', true)
    .orWhere(query => query.where('featured', '=', true).where('priority', '>', 5))
    .all()
})

// Generated SQL
// SELECT * FROM docs WHERE published = true AND (featured = true OR priority > 5)
order(field: keyof Collection, direction: 'ASC' | 'DESC')
Order the query results based on a specific field.

Parameters:
field: The field to order by.
direction: The direction of ordering, either 'ASC' for ascending or 'DESC' for descending.

const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .order('date', 'DESC')
    .all()
})
limit(limit: number)
Limit the number of results returned by the query.

Parameter:
limit: The maximum number of results to return.

const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .limit(10)
    .all()
})
skip(skip: number)
Skip a specified number of results in the query.

Parameter:
skip: The number of results to skip.

const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    // Skip first 5 items
    .skip(5)
    .all()
})
all()
Execute the query and return all matching results.

Returns: A Promise that resolves to an array of all matching documents.

const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs').all()
})
first()
Execute the query and return the first matching result.

Returns: A Promise that resolves to the first matching document, or null if no documents match.

const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs').first()
})
count()
Count the number of matched collection entries based on the query.


const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    // Count matches
    .count()
})

// Returns
5 // number of matches
You can also use count() with other methods defined above such as where() in order to apply additional conditions within the collection query.


const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .where('date', '<', '2024-04-04')
    // Count matches
    .count()
})

// Returns
3 // number of matches for the provided query
Examples
Here is a complete example of how to fetch a list of documents in the docs collections.

index.vue

<script setup lang="ts">
const { data: docs } = await useAsyncData('documents-list', () => {
  return queryCollection('docs')
    .order('date', 'DESC')
    .select('title', 'path', 'description')
    .all()
})
</script>

<template>
  <NuxtLink v-for="doc in docs" :key="doc.path" :to="doc.path">
    <h2>{{ doc.title }}</h2>
    <p>{{ doc.description }}</p>
  </NuxtLink>
</template>
Server Usage
Nuxt Content provides a similar utility to query collections on the server side. The only difference is that you need to pass event as the first argument to the queryCollection function.

server/api/[slug].ts

export default eventHandler(async (event) => {
  const { slug } = getRouterParams(event)
  const page = await queryCollection(event, 'docs').path(slug).first()
  return page
})
Make sure to create server/tsconfig.json file with the following content to avoid type error.

{
  "extends": "../.nuxt/tsconfig.server.json"
}


