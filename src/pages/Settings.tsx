import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Building2, Mail, Bell, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const handleSave = () => {
    toast({ title: "Paramètres sauvegardés", description: "Vos modifications ont été enregistrées." });
  };

  return (
    <AdminLayout title="Paramètres" subtitle="Configuration de la plateforme">
      <div className="max-w-2xl space-y-8">
        {/* Organisation */}
        <div className="stat-card">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-accent" />
            Organisation
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de l'organisation</Label>
              <Input defaultValue="VDE - Vitrine de l'Export" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email de contact</Label>
                <Input defaultValue="contact@vde-export.com" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input defaultValue="+33 1 23 45 67 89" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input defaultValue="12 Rue de l'Export, 75008 Paris" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="stat-card">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-accent" />
            Notifications automatiques
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Confirmation d'inscription</p>
                <p className="text-xs text-muted-foreground">Email + SMS envoyé après inscription</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Rappel J-2</p>
                <p className="text-xs text-muted-foreground">Email de rappel 2 jours avant la session</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Rappel J-1</p>
                <p className="text-xs text-muted-foreground">Email + SMS la veille de la session</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Post-session</p>
                <p className="text-xs text-muted-foreground">Remerciements + enquête J+1</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Envoi automatique des attestations</p>
                <p className="text-xs text-muted-foreground">Génère et envoie l'attestation après validation de la présence</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="stat-card">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-accent" />
            Configuration email
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email expéditeur</Label>
              <Input defaultValue="noreply@vde-export.com" />
            </div>
            <div className="space-y-2">
              <Label>Nom d'affichage</Label>
              <Input defaultValue="VDE - Vitrine de l'Export" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="stat-card">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-accent" />
            Sécurité
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Authentification à deux facteurs</p>
                <p className="text-xs text-muted-foreground">Renforce la sécurité des comptes administrateurs</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Journalisation des accès</p>
                <p className="text-xs text-muted-foreground">Enregistre les connexions et actions admin</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder les paramètres
        </Button>
      </div>
    </AdminLayout>
  );
};

export default Settings;
