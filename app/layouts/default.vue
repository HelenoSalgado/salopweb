<template>
  <div class="app-wrapper">
    <TheHeader />
    <main>
      <Suspense>
        <slot />
        <template #fallback>
          <ContentPlaceholder />
        </template>
      </Suspense>
    </main>
    <TheFooter />
  </div>
</template>
