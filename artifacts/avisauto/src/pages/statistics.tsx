import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGetStats } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function Statistics() {
  const { company } = useAuth();
  const companyId = company?.id as number;

  const { data, isLoading } = useGetStats(companyId, {
    query: { enabled: !!companyId }
  });

  if (isLoading) return <div className="h-full flex items-center justify-center animate-pulse">Chargement des statistiques...</div>;

  const sentimentData = [
    { name: 'Positif', value: data?.sentimentBreakdown.positif || 0, color: 'hsl(161 94% 30%)' },
    { name: 'Neutre', value: data?.sentimentBreakdown.neutre || 0, color: 'hsl(38 92% 50%)' },
    { name: 'Négatif', value: data?.sentimentBreakdown.negatif || 0, color: 'hsl(0 84% 60%)' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Statistiques
        </h1>
        <p className="text-muted-foreground mt-1">Analysez vos performances et la satisfaction client.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Taux de réponse moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-primary">{data?.responseRate}%</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Temps économisé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-secondary">{data?.timeSaved}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Note moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-accent">{data?.averageRating.toFixed(1)} ⭐</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Avis par jour (30 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.reviewsByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Répartition des sentiments</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
