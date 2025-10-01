<template>
  <div class="app-wrapper">
    <TheHeader />
    <main>
      <Suspense>
        <template #default>
        <slot />
        </template>
        <template #fallback>
          <ContentPlaceholder />
        </template>
      </Suspense>
    </main>
    <TheFooter />
  </div>
</template>
