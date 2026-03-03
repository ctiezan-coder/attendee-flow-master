import AdminLayout from "@/components/AdminLayout";
import { attestations } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Send, CheckCircle, Clock, Award, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const Attestations = () => {
  const [data, setData] = useState(attestations);

  const handleGenerate = (id: string) => {
    setData((prev) =>
      prev.map((a) => (a.id === id ? { ...a, generee: true, dateGeneration: new Date().toISOString().split("T")[0] } : a))
    );
    toast({ title: "Attestation générée", description: "Le PDF a été créé avec succès." });
  };

  const handleSend = (id: string) => {
    setData((prev) => prev.map((a) => (a.id === id ? { ...a, envoyee: true } : a)));
    toast({ title: "Attestation envoyée", description: "L'email a été envoyé au participant." });
  };

  const stats = {
    total: data.length,
    generees: data.filter((a) => a.generee).length,
    envoyees: data.filter((a) => a.envoyee).length,
    enAttente: data.filter((a) => !a.generee).length,
  };

  return (
    <AdminLayout title="Attestations" subtitle="Génération et envoi des attestations de participation">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card text-center py-4">
          <Award className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="stat-card text-center py-4">
          <FileText className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-2xl font-bold text-success">{stats.generees}</p>
          <p className="text-xs text-muted-foreground">Générées</p>
        </div>
        <div className="stat-card text-center py-4">
          <Send className="w-5 h-5 text-info mx-auto mb-1" />
          <p className="text-2xl font-bold text-info">{stats.envoyees}</p>
          <p className="text-xs text-muted-foreground">Envoyées</p>
        </div>
        <div className="stat-card text-center py-4">
          <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-accent">{stats.enAttente}</p>
          <p className="text-xs text-muted-foreground">En attente</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" size="sm">
          <Award className="w-4 h-4 mr-2" />
          Générer toutes les attestations
        </Button>
        <Button variant="outline" size="sm">
          <Send className="w-4 h-4 mr-2" />
          Envoyer toutes les attestations
        </Button>
      </div>

      <div className="stat-card overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Participant</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Thématique</TableHead>
              <TableHead>Date session</TableHead>
              <TableHead>Générée</TableHead>
              <TableHead>Envoyée</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.participantPrenom} {a.participantNom}</TableCell>
                <TableCell className="max-w-48 truncate">{a.sessionTitre}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-0 text-xs">
                    {a.thematique}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{a.sessionDate}</TableCell>
                <TableCell>
                  {a.generee ? (
                    <span className="flex items-center gap-1.5 text-success text-sm">
                      <CheckCircle className="w-3.5 h-3.5" /> {a.dateGeneration}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Clock className="w-3.5 h-3.5" /> En attente
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {a.envoyee ? (
                    <span className="text-success text-sm flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Oui
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Non</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {!a.generee && (
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => handleGenerate(a.id)}>
                        <FileText className="w-3 h-3 mr-1" /> Générer
                      </Button>
                    )}
                    {a.generee && (
                      <>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download className="w-3 h-3 mr-1" /> PDF
                        </Button>
                        {!a.envoyee && (
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSend(a.id)}>
                            <Send className="w-3 h-3 mr-1" /> Envoyer
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Attestations;
