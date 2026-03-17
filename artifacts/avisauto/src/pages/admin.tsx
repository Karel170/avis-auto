import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useAdminGetCompanies, useAdminGetStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, Users, Star, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const { data: stats } = useAdminGetStats();
  const { data: companiesData } = useAdminGetCompanies();

  if (user?.role !== 'admin') return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-destructive" />
          Administration
        </h1>
        <p className="text-muted-foreground mt-1">Supervision globale de la plateforme SaaS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground uppercase">Entreprises</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold flex items-center gap-2"><Users className="w-6 h-6 text-primary"/> {stats?.totalCompanies || 0}</div></CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground uppercase">Avis traités</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold flex items-center gap-2"><MessageSquare className="w-6 h-6 text-secondary"/> {stats?.totalReviews || 0}</div></CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground uppercase">Réponses publiées</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold flex items-center gap-2"><Star className="w-6 h-6 text-accent"/> {stats?.totalPublished || 0}</div></CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground uppercase">Abonnements actifs</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats?.activeSubscriptions || 0}</div></CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Liste des entreprises clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Entreprise</TableHead>
                <TableHead>Secteur</TableHead>
                <TableHead>Avis total</TableHead>
                <TableHead>Taux de réponse</TableHead>
                <TableHead>Abonnement</TableHead>
                <TableHead>Date d'inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companiesData?.companies.map(company => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.sector || '-'}</TableCell>
                  <TableCell>{company.totalReviews}</TableCell>
                  <TableCell>{company.responseRate}%</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold uppercase ${company.subscriptionStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                      {company.subscriptionStatus}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
