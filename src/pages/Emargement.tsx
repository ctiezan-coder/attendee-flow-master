import AdminLayout from "@/components/AdminLayout";
import { sessions, participants, emargements } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QrCode, CheckCircle, Clock, Users, Scan, WifiOff } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

const Emargement = () => {
  const [selectedSession, setSelectedSession] = useState<string>("4");
  const session = sessions.find((s) => s.id === selectedSession);

  const sessionEmargements = emargements.filter((e) => e.sessionId === selectedSession);
  const participantMap = Object.fromEntries(participants.map((p) => [p.id, p]));

  const [scannedIds, setScannedIds] = useState<Set<string>>(
    new Set(sessionEmargements.map((e) => e.participantId))
  );

  const handleScan = (participantId: string) => {
    setScannedIds((prev) => {
      const next = new Set(prev);
      next.add(participantId);
      return next;
    });
    const p = participantMap[participantId];
    toast({
      title: "Émargement enregistré",
      description: `${p?.prenom} ${p?.nom} – ${format(new Date(), "HH:mm:ss")}`,
    });
  };

  const tauxPresence = session ? Math.round((scannedIds.size / session.inscrits) * 100) : 0;

  return (
    <AdminLayout title="Émargement" subtitle="Suivi de présence en temps réel">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left panel */}
        <div className="lg:w-80 space-y-4">
          <div className="stat-card">
            <label className="text-sm font-medium text-foreground mb-2 block">Session</label>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.titre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {session && (
            <>
              <div className="stat-card text-center">
                <p className="text-sm text-muted-foreground mb-1">Taux de présence</p>
                <p className="text-4xl font-bold text-foreground">{tauxPresence}%</p>
                <div className="w-full bg-muted rounded-full h-2.5 mt-3">
                  <div
                    className="bg-accent h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${tauxPresence}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{scannedIds.size} présents</span>
                  <span>{session.inscrits} inscrits</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="stat-card text-center py-4">
                  <QrCode className="w-5 h-5 text-accent mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">
                    {[...scannedIds].filter((id) => {
                      const e = sessionEmargements.find((em) => em.participantId === id);
                      return !e || e.mode === "qr_code";
                    }).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Présentiel</p>
                </div>
                <div className="stat-card text-center py-4">
                  <WifiOff className="w-5 h-5 text-info mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">
                    {[...scannedIds].filter((id) => {
                      const e = sessionEmargements.find((em) => em.participantId === id);
                      return e && e.mode === "lien_en_ligne";
                    }).length}
                  </p>
                  <p className="text-xs text-muted-foreground">En ligne</p>
                </div>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Scan className="w-4 h-4 mr-2" />
                Scanner un QR code
              </Button>
            </>
          )}
        </div>

        {/* Right panel - participant list */}
        <div className="flex-1">
          <div className="stat-card overflow-hidden p-0">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Liste des inscrits
              </h3>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                {scannedIds.size}/{session?.inscrits ?? 0}
              </Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Participant</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Horodatage</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p) => {
                  const isPresent = scannedIds.has(p.id);
                  const emarg = sessionEmargements.find((e) => e.participantId === p.id);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.prenom} {p.nom}</TableCell>
                      <TableCell className="text-muted-foreground">{p.entreprise}</TableCell>
                      <TableCell>
                        {emarg ? (
                          <Badge variant="secondary" className="text-xs border-0">
                            {emarg.mode === "qr_code" ? "QR Code" : "En ligne"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {emarg ? format(new Date(emarg.horodatage), "HH:mm:ss") : "—"}
                      </TableCell>
                      <TableCell>
                        {isPresent ? (
                          <span className="flex items-center gap-1.5 text-success text-sm font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Présent
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Clock className="w-3.5 h-3.5" /> En attente
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {!isPresent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScan(p.id)}
                            className="text-xs"
                          >
                            Émarger
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Emargement;
