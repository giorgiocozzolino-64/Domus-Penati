export const copy = {
  home: {
    title: "Bentornato a casa.",
    subtitle:
      "La tecnologia più avanzata non è quella che ci porta più lontano. È quella che ci riporta a casa.",
    cta: "Inizia la tua Domus",
  },

  register: {
    title: "Crea la tua Domus",
    subtitle: "Inizia il viaggio della tua famiglia.",
    cta: "Crea la mia Domus",
    loginLink: "Ho già una Domus",

    fields: {
      firstName: {
        label: "Il tuo nome",
        placeholder: "Mario",
      },
      lastName: {
        label: "Il tuo cognome",
        placeholder: "Rossi",
      },
      email: {
        label: "Email",
        placeholder: "nome@email.com",
      },
      password: {
        label: "Password",
        placeholder: "Minimo 8 caratteri",
      },
      familyName: {
        label: "Nome della famiglia",
        placeholder: "Famiglia Rossi",
      },
    },

    errors: {
      generic: "Si è verificato un errore. Riprova.",
    },
  },

  login: {
    title: "Accedi alla tua Domus",
    subtitle: "Rientra nella casa digitale della tua famiglia.",
    cta: "Accedi",
    registerLink: "Non hai ancora una Domus?",

    fields: {
      email: {
        label: "Email",
        placeholder: "nome@email.com",
      },
      password: {
        label: "Password",
        placeholder: "La tua password",
      },
    },

    errors: {
      generic: "Accesso non riuscito. Controlla i dati e riprova.",
    },
  },

  welcome: {
    greeting: (familyName: string) => `Benvenuto nella Domus ${familyName}.`,
    greetingAlt: "Benvenuto nella tua Domus.",
    title: "La tua casa digitale è pronta.",
    subtitle:
      "Qui inizierai a custodire i ricordi della tua famiglia.\nOgni momento importante resterà per sempre.",
    cta: "Crea il primo ricordo",
    secondaryCta: "Invita un familiare",

    empty: {
      note: "Non ci sono ancora ricordi. Il primo aspetta solo te.",
    },
  },

  firstMemory: {
    title: "Crea il primo ricordo",
    subtitle:
      "Ogni famiglia ha un momento da cui tutto comincia. Scrivi il primo ricordo della tua Domus.",
    cta: "Salva il ricordo",
    back: "Torna alla Domus",

    fields: {
      title: {
        label: "Titolo del ricordo",
        placeholder: "La nostra prima giornata insieme",
      },
      description: {
        label: "Racconto",
        placeholder: "Scrivi qui il ricordo che vuoi custodire...",
      },
      date: {
        label: "Data del ricordo",
      },
      photo: {
        label: "Foto del ricordo",
      },
    },

    errors: {
      generic: "Non è stato possibile salvare il ricordo. Riprova.",
      upload: "Non è stato possibile caricare la foto. Riprova.",
    },

    success: "Il primo ricordo è stato salvato.",
  },
}