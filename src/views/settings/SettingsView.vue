<template>
  <div class="main-container shadow-none rounded-none">
    <section
      class="sm:flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Settings</h1>
      <button class="btn btn-sm btn-blue">SAVE</button>
    </section>

    <section class="container">
      <form class="space-y-6">
        <!-- Enable 2FA -->
        <div class="flex items-center justify-between">
          <label class="text-lg font-medium"
            >Enable Two-Factor Authentication (2FA)</label
          >
          <input type="checkbox" class="w-5 h-5 accent-blue-500" />
        </div>

        <!-- Email Notifications -->
        <div class="flex items-center justify-between">
          <label class="text-lg font-medium">Email Notifications</label>
          <input type="checkbox" class="w-5 h-5 accent-blue-500" />
        </div>

        <!-- Language Selector -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
          <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
          <select class="border rounded p-2 w-full sm:w-auto">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
          <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
          <select class="border rounded p-2 w-full sm:w-auto">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
          <label class="text-lg font-medium mb-2 sm:mb-0">Language</label>
          <select class="border rounded p-2 w-full sm:w-auto">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <!-- Theme Selector -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
          <label class="text-lg font-medium mb-2 sm:mb-0">Theme</label>
          <select class="border rounded p-2 w-full sm:w-auto">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </form>
    </section>
  </div>
</template>
