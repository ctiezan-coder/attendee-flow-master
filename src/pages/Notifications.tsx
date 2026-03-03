import AdminLayout from "@/components/AdminLayout";
import { notifications } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Bell, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

const typeConfig = {
  confirmation: { label: "Confirmation", icon: CheckCircle, className: "bg-success/10 text-success" },
  rappel_j2: { label: "Rappel J-2", icon: Bell, className: "bg-info/10 text-info" },
  rappel_j1: { label: "Rappel J-1", icon: Bell, className: "bg-accent/10 text-accent" },
  post_session: { label: "Post-session", icon: Mail, className: "bg-muted text-muted-foreground" },
  annulation: { label: "Annulation", icon: AlertTriangle, className: "bg-destructive/10 text-destructive" },
};

const statutConfig = {
  envoye: { label: "Envoyé", icon: CheckCircle, className: "text-success" },
  en_attente: { label: "En attente", icon: Clock, className: "text-accent" },
  echoue: { label: "Échoué", icon: XCircle, className: "text-destructive" },
};

type FilterType = "all" | "confirmation" | "rappel_j2" | "rappel_j1" | "post_session" | "annulation";

const Notifications = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const filters: { label: string; value: FilterType }[] = [
    { label: "Toutes", value: "all" },
    { label: "Confirmations", value: "confirmation" },
    { label: "Rappels J-2", value: "rappel_j2" },
    { label: "Rappels J-1", value: "rappel_j1" },
    { label: "Post-session", value: "post_session" },
    { label: "Annulations", value: "annulation" },
  ];

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  const stats = {
    total: notifications.length,
    envoyees: notifications.filter((n) => n.statut === "envoye").length,
    enAttente: notifications.filter((n) => n.statut === "en_attente").length,
    echouees: notifications.filter((n) => n.statut === "echoue").length,
  };

  return (
    <AdminLayout title="Notifications" subtitle="Communications automatiques et manuelles">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card text-center py-4">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="stat-card text-center py-4">
          <p className="text-2xl font-bold text-success">{stats.envoyees}</p>
          <p className="text-xs text-muted-foreground">Envoyées</p>
        </div>
        <div className="stat-card text-center py-4">
          <p className="text-2xl font-bold text-accent">{stats.enAttente}</p>
          <p className="text-xs text-muted-foreground">En attente</p>
        </div>
        <div className="stat-card text-center py-4">
          <p className="text-2xl font-bold text-destructive">{stats.echouees}</p>
          <p className="text-xs text-muted-foreground">Échouées</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="stat-card overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Type</TableHead>
              <TableHead>Destinataire</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Date d'envoi</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((n) => {
              const tc = typeConfig[n.type];
              const sc = statutConfig[n.statut];
              return (
                <TableRow key={n.id}>
                  <TableCell>
                    <Badge variant="secondary" className={`${tc.className} border-0 text-xs`}>
                      {tc.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{n.destinataire}</TableCell>
                  <TableCell className="font-medium max-w-48 truncate">{n.sessionTitre}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      {n.canal.includes("SMS") && <MessageSquare className="w-3.5 h-3.5" />}
                      <span>{n.canal}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(n.dateEnvoi), "d MMM yyyy, HH:mm", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1.5 text-sm font-medium ${sc.className}`}>
                      <sc.icon className="w-3.5 h-3.5" />
                      {sc.label}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
