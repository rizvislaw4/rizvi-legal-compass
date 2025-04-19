
import AppLayout from "@/components/layouts/AppLayout";
import ThemeSelector from "@/components/settings/ThemeSelector";

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <ThemeSelector />
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
