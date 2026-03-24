import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, FileText, ArrowLeft } from 'lucide-react';

const tabs = [
  { id: 'cgu', label: 'CGU', icon: FileText },
  { id: 'privacy', label: 'Politique de confidentialité', icon: Shield },
];

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="text-slate-400 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function CGU() {
  return (
    <div>
      <Section title="1. Objet du service">
        <p>
          AvisAuto est un service en ligne permettant aux professionnels de gérer automatiquement leurs avis Google My Business.
          Le service comprend l'import d'avis, la génération automatisée de réponses personnalisées,
          et la publication de ces réponses.
        </p>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
          de la plateforme AvisAuto accessible à l'adresse app.avisauto.fr.
        </p>
      </Section>

      <Section title="2. Accès au service">
        <p>
          L'accès au service est réservé aux professionnels majeurs (personnes physiques ou morales).
          L'inscription requiert la création d'un compte avec une adresse email valide et un mot de passe sécurisé.
        </p>
        <p>
          L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion.
          Toute utilisation du service avec ses identifiants est réputée effectuée par l'utilisateur.
        </p>
        <p>
          AvisAuto se réserve le droit de suspendre ou de résilier un compte en cas de violation des présentes CGU
          ou de comportement frauduleux.
        </p>
      </Section>

      <Section title="3. Responsabilités">
        <p>
          AvisAuto s'engage à fournir le service avec le plus grand soin. Cependant, la plateforme est fournie
          "en l'état" sans garantie d'absence de bugs ou d'interruptions.
        </p>
        <p>
          L'utilisateur est seul responsable du contenu des réponses qu'il publie sur Google.
          Les réponses générées automatiquement doivent être relues et validées par l'utilisateur avant publication.
        </p>
        <p>
          AvisAuto décline toute responsabilité en cas de dommages directs ou indirects résultant de
          l'utilisation du service, d'une interruption de service, ou d'une réponse inappropriée générée automatiquement.
        </p>
      </Section>

      <Section title="4. Propriété intellectuelle">
        <p>
          L'ensemble des éléments constituant la plateforme AvisAuto (code source, design, marque, logo)
          sont protégés par le droit de la propriété intellectuelle et appartiennent exclusivement à AvisAuto.
        </p>
        <p>
          L'utilisateur conserve la propriété de ses données (avis importés, réponses créées).
          Il accorde à AvisAuto une licence limitée pour traiter ces données dans le cadre de la fourniture du service.
        </p>
      </Section>

      <Section title="5. Résiliation">
        <p>
          L'utilisateur peut résilier son abonnement à tout moment depuis les paramètres de son compte.
          La résiliation prend effet à la fin de la période de facturation en cours.
        </p>
        <p>
          En cas de résiliation, l'utilisateur conserve accès à ses données pendant 30 jours,
          après quoi elles sont supprimées définitivement.
        </p>
        <p>
          AvisAuto peut résilier un compte sans préavis en cas de violation grave des présentes CGU,
          d'utilisation frauduleuse, ou de non-paiement.
        </p>
      </Section>

      <Section title="6. Droit applicable">
        <p>
          Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'engagent
          à rechercher une solution amiable avant tout recours judiciaire.
        </p>
        <p>
          À défaut d'accord amiable, tout litige sera soumis à la compétence exclusive des tribunaux
          compétents du ressort du siège social d'AvisAuto.
        </p>
        <p>
          Ces CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés par email
          de toute modification substantielle.
        </p>
      </Section>
    </div>
  );
}

function Privacy() {
  return (
    <div>
      <Section title="1. Données collectées">
        <p>Dans le cadre de l'utilisation du service, AvisAuto collecte les données suivantes :</p>
        <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
          <li>Données d'identification : nom, adresse email</li>
          <li>Données d'entreprise : nom de l'établissement, secteur, adresse</li>
          <li>Avis Google : texte, auteur, note, date (importés depuis Google Maps via Apify)</li>
          <li>Réponses générées : texte des réponses automatisées et des réponses finales</li>
          <li>Données de connexion : adresse IP, navigateur, logs d'accès</li>
        </ul>
      </Section>

      <Section title="2. Finalité du traitement">
        <p>Les données collectées sont utilisées aux fins suivantes :</p>
        <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
          <li>Fourniture du service de gestion d'avis et de génération automatisée de réponses</li>
          <li>Gestion des comptes utilisateurs et authentification</li>
          <li>Amélioration de la qualité du service</li>
          <li>Communication relative au service (mises à jour, alertes)</li>
          <li>Facturation et gestion des abonnements</li>
        </ul>
        <p className="mt-2">
          Base légale : exécution du contrat (art. 6.1.b RGPD) pour la fourniture du service,
          et intérêt légitime (art. 6.1.f RGPD) pour l'amélioration du service.
        </p>
      </Section>

      <Section title="3. Durée de conservation">
        <p>Les données sont conservées selon les durées suivantes :</p>
        <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
          <li>Données de compte : pendant toute la durée de l'abonnement, puis 30 jours après résiliation</li>
          <li>Avis et réponses : pendant toute la durée de l'abonnement, puis 30 jours après résiliation</li>
          <li>Logs de connexion : 12 mois maximum</li>
          <li>Données de facturation : 10 ans (obligation légale)</li>
        </ul>
      </Section>

      <Section title="4. Droits RGPD">
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
        <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
          <li><strong className="text-slate-300">Droit d'accès</strong> : obtenir une copie de vos données personnelles</li>
          <li><strong className="text-slate-300">Droit de rectification</strong> : corriger des données inexactes ou incomplètes</li>
          <li><strong className="text-slate-300">Droit à l'effacement</strong> : demander la suppression de vos données</li>
          <li><strong className="text-slate-300">Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
          <li><strong className="text-slate-300">Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
          <li><strong className="text-slate-300">Droit à la limitation</strong> : demander la suspension temporaire du traitement</li>
        </ul>
        <p className="mt-2">
          Pour exercer ces droits, contactez-nous à l'adresse indiquée ci-dessous.
          Vous disposez également du droit de déposer une réclamation auprès de la CNIL (www.cnil.fr).
        </p>
      </Section>

      <Section title="5. Contact DPO">
        <p>
          Pour toute question relative à la protection de vos données personnelles ou pour exercer
          vos droits, vous pouvez contacter notre délégué à la protection des données (DPO) à l'adresse suivante :
        </p>
        <p className="mt-2 p-3 bg-slate-800/60 rounded-lg border border-slate-700/50">
          <strong className="text-slate-300">Email :</strong>{' '}
          <a href="mailto:privacy@avisauto.fr" className="text-blue-400 hover:text-blue-300 transition-colors">
            privacy@avisauto.fr
          </a>
          <br />
          Nous nous engageons à répondre à votre demande dans un délai de 30 jours.
        </p>
      </Section>

      <Section title="6. Sous-traitants">
        <p>
          AvisAuto fait appel aux sous-traitants suivants pour la fourniture du service.
          Ces sous-traitants traitent vos données dans le respect du RGPD :
        </p>
        <div className="mt-3 space-y-3">
          {[
            {
              name: 'Supabase',
              role: 'Hébergement et base de données',
              desc: 'Stockage sécurisé des données utilisateurs et d\'entreprise. Hébergé en Europe.',
              link: 'https://supabase.com/privacy',
            },
            {
              name: 'OpenAI',
              role: 'Intelligence artificielle (GPT-4o-mini)',
              desc: 'Génération des réponses aux avis. Les textes des avis sont transmis à OpenAI pour traitement.',
              link: 'https://openai.com/privacy',
            },
            {
              name: 'Apify',
              role: 'Scraping et collecte d\'avis',
              desc: 'Import automatique des avis Google Maps via l\'API Apify.',
              link: 'https://apify.com/privacy-policy',
            },
          ].map((st) => (
            <div key={st.name} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/50">
              <div className="flex items-start justify-between gap-2 mb-1">
                <strong className="text-slate-200 text-sm">{st.name}</strong>
                <span className="text-xs text-slate-500 flex-shrink-0">{st.role}</span>
              </div>
              <p className="text-xs text-slate-400">{st.desc}</p>
              <a href={st.link} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1 inline-block">
                Politique de confidentialité →
              </a>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

export default function Legal() {
  const [activeTab, setActiveTab] = useState('cgu');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="font-bold text-white">AvisAuto</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Accueil
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mentions légales</h1>
          <p className="text-slate-400">Dernière mise à jour : mars 2025</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-800/60 rounded-xl border border-slate-700/50 mb-8 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
          {activeTab === 'cgu' ? <CGU /> : <Privacy />}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-8">
          Pour toute question, contactez-nous à{' '}
          <a href="mailto:contact@avisauto.fr" className="text-slate-500 hover:text-slate-400 transition-colors">
            contact@avisauto.fr
          </a>
        </p>
      </main>
    </div>
  );
}
