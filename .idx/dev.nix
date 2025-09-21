<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} /> {/* La page par défaut du tableau de bord */}
  <Route path="models" element={<AdminModels />} />
  <Route path="payments" element={<AdminPayments />} />
  <Route path="casting-applications" element={<AdminCasting />} />
  {/* ... et ainsi de suite pour toutes les autres pages admin */}
</Route>
{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
  ];
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}