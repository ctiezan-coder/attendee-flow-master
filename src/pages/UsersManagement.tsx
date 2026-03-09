import AdminLayout from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Loader2, UserPlus, Shield, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
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
    mutationFn: async ({ id, actif }: { id: string; actif: boolean }) => {
      const { error } = await supabase.from("admins").update({ actif }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast({ title: "Statut mis à jour" });
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("admins").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
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

  return (
    <AdminLayout title="Gestion des utilisateurs" subtitle="Gérez les administrateurs de la plateforme">
      {/* Add admin form */}
      <div className="stat-card mb-6">
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
                        toggleActive.mutate({ id: admin.id, actif: checked })
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
                              onClick={() => deleteAdmin.mutate(admin.id)}
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
    </AdminLayout>
  );
};

export default UsersManagement;
