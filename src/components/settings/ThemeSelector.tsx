
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, Laptop } from "lucide-react";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark" | "system");
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${value} mode`,
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Theme Preferences</h2>
      <RadioGroup
        defaultValue={theme}
        onValueChange={handleThemeChange}
        className="grid gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="light" />
          <Label htmlFor="light" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Light
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="dark" />
          <Label htmlFor="dark" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Dark
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="system" id="system" />
          <Label htmlFor="system" className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            System
          </Label>
        </div>
      </RadioGroup>
    </Card>
  );
};

export default ThemeSelector;
