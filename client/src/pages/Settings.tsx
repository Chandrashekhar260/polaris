import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FolderOpen, Download, Trash2 } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your learning agent and local watcher
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Local File Watcher</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor your coding activity in real-time
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="watch-path">Watched Directory</Label>
            <div className="flex gap-2">
              <Input
                id="watch-path"
                placeholder="/path/to/your/projects"
                className="font-mono text-sm"
                defaultValue="~/Development/projects"
                data-testid="input-watch-path"
              />
              <Button variant="outline" size="icon" data-testid="button-browse">
                <FolderOpen className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The local Python watcher script monitors this directory for file changes
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backend-url">Backend URL</Label>
            <Input
              id="backend-url"
              placeholder="https://your-replit-url.repl.co"
              className="font-mono text-sm"
              data-testid="input-backend-url"
            />
            <p className="text-xs text-muted-foreground">
              Your Replit backend service URL for sending learning data
            </p>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full" data-testid="button-download-watcher">
              <Download className="w-4 h-4 mr-2" />
              Download Watcher Script
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Get the Python script to run on your local machine
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Preferences</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-generate Recommendations</Label>
              <p className="text-sm text-muted-foreground">
                Automatically create recommendations after each session
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-auto-recommend" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">
                Receive AI-generated weekly progress summaries
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-weekly-summary" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Track All File Types</Label>
              <p className="text-sm text-muted-foreground">
                Monitor all files, not just code files
              </p>
            </div>
            <Switch data-testid="switch-track-all" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Clear All Learning Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete all sessions, recommendations, and progress
              </p>
            </div>
            <Button variant="destructive" data-testid="button-clear-data">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
