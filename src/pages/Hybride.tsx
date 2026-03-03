import AdminLayout from "@/components/AdminLayout";
import { sessions } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Link2, MonitorPlay, Users, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Hybride = () => {
  const hybridSessions = sessions.filter((s) => s.mode === "hybride" || s.mode === "en_ligne");

  return (
    <AdminLayout title="Sessions hybrides" subtitle="Gestion de la visioconférence et du replay">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card text-center py-4">
          <Video className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{hybridSessions.length}</p>
          <p className="text-xs text-muted-foreground">Sessions hybrides/en ligne</p>
        </div>
        <div className="stat-card text-center py-4">
          <Users className="w-5 h-5 text-info mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {hybridSessions.reduce((acc, s) => acc + Math.round(s.inscrits * 0.3), 0)}
          </p>
          <p className="text-xs text-muted-foreground">Participants à distance (est.)</p>
        </div>
        <div className="stat-card text-center py-4">
          <MonitorPlay className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">1</p>
          <p className="text-xs text-muted-foreground">Replays disponibles</p>
        </div>
      </div>

      <div className="space-y-4">
        {hybridSessions.map((session) => {
          const isUpcoming = new Date(session.date) > new Date();
          const modeLabels = { hybride: "Hybride", en_ligne: "En ligne", presentiel: "Présentiel" };

          return (
            <div key={session.id} className="stat-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-info/10 text-info border-0 text-xs">
                      {modeLabels[session.mode]}
                    </Badge>
                    <Badge variant="secondary" className={`border-0 text-xs ${isUpcoming ? "bg-accent/10 text-accent" : "bg-success/10 text-success"}`}>
                      {isUpcoming ? "À venir" : "Terminée"}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{session.titre}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(session.date), "d MMMM yyyy, HH:mm", { locale: fr })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      ~{Math.round(session.inscrits * 0.3)} participants à distance
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {isUpcoming ? (
                    <>
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Video className="w-3.5 h-3.5 mr-1.5" />
                        Configurer visio
                      </Button>
                      <Button size="sm" variant="outline">
                        <Link2 className="w-3.5 h-3.5 mr-1.5" />
                        Copier le lien
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline">
                        <MonitorPlay className="w-3.5 h-3.5 mr-1.5" />
                        Voir le replay
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        Lien émargement
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default Hybride;
