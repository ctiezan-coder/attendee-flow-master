import AdminLayout from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Loader2, UserPlus, Shield, ShieldCheck, Trash2, History, Clock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SUPERADMIN_EMAILS = ["t.coulibaly@cotedivoirexport.ci", "h.cisse@cotedivoirexport.ci"];

const logAction = async (action: string, details: string, email: string) => {
  await supabase.from("audit_log").insert({ action, details, user_email: email });
};

const UsersManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState("");
  const [newNom, setNewNom] = useState("");
  const [newRole, setNewRole] = useState("admin");

  const isSuperAdmin = user?.email ? SUPERADMIN_EMAILS.includes(user.email) : false;

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admins"] });
    queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
  };

  const addAdmin = useMutation({
    mutationFn: async () => {
      if (!newEmail.endsWith("@cotedivoirexport.ci")) {
        throw new Error("Seuls les emails @cotedivoirexport.ci sont autorisés");
      }
      const { error } = await supabase.from("admins").insert({
        email: newEmail,
        nom_complet: newNom || null,
        role: newRole,
      });
      if (error) throw error;
      await logAction("Ajout admin", `${newNom || newEmail} ajouté en tant que ${newRole}`, user?.email || "");
    },
    onSuccess: () => {
      invalidateAll();
      setNewEmail("");
      setNewNom("");
      setNewRole("admin");
      toast({ title: "Administrateur ajouté avec succès" });
    },
    onError: (err: any) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, actif, adminEmail }: { id: string; actif: boolean; adminEmail: string }) => {
      const { error } = await supabase.from("admins").update({ actif }).eq("id", id);
      if (error) throw error;
      await logAction(
        actif ? "Activation admin" : "Désactivation admin",
        `${adminEmail} ${actif ? "activé" : "désactivé"}`,
        user?.email || ""
      );
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Statut mis à jour" });
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async ({ id, adminEmail }: { id: string; adminEmail: string }) => {
      const { error } = await supabase.from("admins").delete().eq("id", id);
      if (error) throw error;
      await logAction("Suppression admin", `${adminEmail} supprimé`, user?.email || "");
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Administrateur supprimé" });
    },
  });

  if (!isSuperAdmin) {
    return (
      <AdminLayout title="Gestion des utilisateurs">
        <div className="text-center py-16">
          <Shield className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Accès réservé aux super-administrateurs.</p>
        </div>
      </AdminLayout>
    );
  }

  const actionColors: Record<string, string> = {
    "Ajout admin": "bg-success/10 text-success",
    "Suppression admin": "bg-destructive/10 text-destructive",
    "Activation admin": "bg-info/10 text-info",
    "Désactivation admin": "bg-warning/10 text-warning",
  };

  return (
    <AdminLayout title="Gestion des utilisateurs" subtitle="Gérez les administrateurs de la plateforme">
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="w-4 h-4" /> Journal d'activité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Add admin form */}
          <div className="stat-card">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-accent" />
              Ajouter un administrateur
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Nom complet"
                value={newNom}
                onChange={(e) => setNewNom(e.target.value)}
                className="sm:w-48"
              />
              <Input
                placeholder="email@cotedivoirexport.ci"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="sm:flex-1"
              />
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => addAdmin.mutate()}
                disabled={!newEmail || addAdmin.isPending}
              >
                {addAdmin.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ajouter"}
              </Button>
            </div>
          </div>

          {/* Admins table */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="stat-card p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Actif</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins?.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.nom_complet || "—"}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            admin.role === "superadmin"
                              ? "bg-accent/10 text-accent border-0"
                              : "bg-muted text-muted-foreground border-0"
                          }
                        >
                          <span className="flex items-center gap-1">
                            {admin.role === "superadmin" ? (
                              <ShieldCheck className="w-3 h-3" />
                            ) : (
                              <Shield className="w-3 h-3" />
                            )}
                            {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={admin.actif}
                          onCheckedChange={(checked) =>
                            toggleActive.mutate({ id: admin.id, actif: checked, adminEmail: admin.email })
                          }
                          disabled={admin.email === user?.email}
                        />
                      </TableCell>
                      <TableCell>
                        {admin.email !== user?.email && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cet administrateur ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {admin.email} n'aura plus accès au back-office.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteAdmin.mutate({ id: admin.id, adminEmail: admin.email })}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div className="stat-card">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-accent" />
              Journal d'activité
            </h3>

            {logsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : auditLogs && auditLogs.length > 0 ? (
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="mt-0.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${actionColors[log.action] || "bg-muted text-muted-foreground"}`}>
                        <UserIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className={`${actionColors[log.action] || ""} border-0 text-xs`}>
                          {log.action}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(log.created_at), "d MMM yyyy à HH:mm", { locale: fr })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{log.details}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">par {log.user_email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Aucune activité enregistrée pour le moment.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default UsersManagement;
