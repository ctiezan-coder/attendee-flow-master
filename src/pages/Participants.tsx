import AdminLayout from "@/components/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ChevronDown, ChevronRight, Users } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Participants = () => {
  const [search, setSearch] = useState("");
  const [openFormations, setOpenFormations] = useState<Set<string>>(new Set());

  const { data: inscriptions, isLoading } = useQuery({
    queryKey: ["admin-participants-by-formation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_inscriptions")
        .select("*")
        .order("date_debut", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = inscriptions?.filter(
    (i) =>
      `${i.nom_dirigeant} ${i.nom_entreprise} ${i.email} ${i.formation_titre}`.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  // Group by formation
  const grouped = filtered.reduce<Record<string, { titre: string; theme: string; date_debut: string | null; lieu: string | null; statut: string | null; participants: typeof filtered }>>((acc, i) => {
    const key = i.formation_id || "unknown";
    if (!acc[key]) {
      acc[key] = {
        titre: i.formation_titre || "Sans titre",
        theme: i.theme || "",
        date_debut: i.date_debut,
        lieu: i.lieu,
        statut: i.statut_formation,
        participants: [],
      };
    }
    acc[key].participants.push(i);
    return acc;
  }, {});

  const toggleFormation = (id: string) => {
    setOpenFormations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const statutColor = (statut: string | null) => {
    switch (statut) {
      case "A venir": return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "En cours": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "Terminée": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AdminLayout title="Participants" subtitle="Liste des participants inscrits par formation">
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un participant ou une formation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          Aucun participant trouvé.
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([formationId, group]) => {
            const isOpen = openFormations.has(formationId);
            return (
              <Collapsible key={formationId} open={isOpen} onOpenChange={() => toggleFormation(formationId)}>
                <CollapsibleTrigger asChild>
                  <button className="stat-card w-full flex items-center gap-4 p-4 text-left hover:bg-accent/50 transition-colors cursor-pointer">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{group.titre}</span>
                        <Badge variant="outline" className={statutColor(group.statut)}>
                          {group.statut}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-3 flex-wrap">
                        <span>{group.theme}</span>
                        {group.date_debut && (
                          <span>{format(new Date(group.date_debut), "d MMM yyyy", { locale: fr })}</span>
                        )}
                        {group.lieu && <span>{group.lieu}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{group.participants.length}</span>
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="stat-card overflow-hidden p-0 mt-1 ml-8">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Dirigeant</TableHead>
                          <TableHead>Entreprise</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Téléphone</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Présence</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.participants.map((p) => (
                          <TableRow key={p.inscription_id}>
                            <TableCell className="font-medium">{p.nom_dirigeant}</TableCell>
                            <TableCell>{p.nom_entreprise}</TableCell>
                            <TableCell className="text-muted-foreground">{p.email}</TableCell>
                            <TableCell className="text-muted-foreground">{p.telephone || "—"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {p.statut_inscription}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {p.present === true ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200" variant="outline">Présent</Badge>
                              ) : p.present === false ? (
                                <Badge className="bg-red-500/10 text-red-600 border-red-200" variant="outline">Absent</Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default Participants;
