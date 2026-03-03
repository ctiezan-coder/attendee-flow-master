import AdminLayout from "@/components/AdminLayout";
import { reportingData } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const COLORS = [
  "hsl(32, 95%, 44%)",
  "hsl(222, 47%, 11%)",
  "hsl(142, 71%, 45%)",
  "hsl(217, 91%, 60%)",
  "hsl(0, 84%, 60%)",
];

const Reporting = () => {
  const handleExport = (format: string) => {
    toast({ title: `Export ${format}`, description: `Le rapport sera généré en ${format} et téléchargé.` });
  };

  return (
    <AdminLayout title="Reporting" subtitle="Indicateurs clés et statistiques">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => handleExport("Excel")}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}>
          <FileText className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport("Rapport trimestriel")}>
          <Download className="w-4 h-4 mr-2" />
          Rapport trimestriel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inscrits vs Présents par session */}
        <div className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">Inscrits vs Présents par session</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={reportingData.presenceParSession}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="session" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(214, 32%, 91%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="inscrits" fill="hsl(222, 47%, 11%)" radius={[4, 4, 0, 0]} name="Inscrits" />
              <Bar dataKey="presents" fill="hsl(32, 95%, 44%)" radius={[4, 4, 0, 0]} name="Présents" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Évolution mensuelle */}
        <div className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">Évolution de la fréquentation</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={reportingData.evolutionMensuelle}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(214, 32%, 91%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line type="monotone" dataKey="inscrits" stroke="hsl(222, 47%, 11%)" strokeWidth={2} dot={{ r: 4 }} name="Inscrits" />
              <Line type="monotone" dataKey="presents" stroke="hsl(32, 95%, 44%)" strokeWidth={2} dot={{ r: 4 }} name="Présents" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par secteur */}
        <div className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">Répartition par secteur d'activité</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={reportingData.parSecteur}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ strokeWidth: 1 }}
              >
                {reportingData.parSecteur.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par niveau export */}
        <div className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">Répartition par niveau d'export</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={reportingData.parNiveau} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} stroke="hsl(215, 16%, 47%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(214, 32%, 91%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="value" fill="hsl(32, 95%, 44%)" radius={[0, 4, 4, 0]} name="Participants" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reporting;
