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
      firstName: { label: "Il tuo nome", placeholder: "Mario" },
      lastName: { label: "Il tuo cognome", placeholder: "Rossi" },
      email: { label: "Email", placeholder: "nome@email.com" },
      password: { label: "Password", placeholder: "Minimo 8 caratteri" },
      familyName: { label: "Nome della famiglia", placeholder: "Famiglia Rossi" },
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
      email: { label: "Email", placeholder: "nome@email.com" },
      password: { label: "Password", placeholder: "La tua password" },
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
    title: "Di chi vuoi conservare il ricordo?",
    subtitle: "Registra un video, una voce, una foto o un documento da custodire nella tua Domus.",
    cta: "Salva il ricordo",
    back: "Torna alla Domus",
    or: "oppure",
    upload: "Carica un file",

    record: {
      label: "Registra",
      start: "Inizia registrazione",
      stop: "Ferma registrazione",
      note: "Puoi registrare un video direttamente dal tuo dispositivo.",
    },

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
      upload: "Non è stato possibile caricare il file. Riprova.",
    },

    success: "Il primo ricordo è stato salvato.",
  },

  gallery: {
    title: "I vostri ricordi",
    subtitle: "La memoria della vostra famiglia, raccolta nella vostra Domus.",
    back: "Torna alla Domus",
    add: "Aggiungi",

    types: {
      video: "Video",
      audio: "Audio",
      photo: "Foto",
      document: "Documento",
      text: "Testo",
    },

    empty: {
      title: "Nessun ricordo ancora",
      subtitle:
        "Ogni famiglia ha un primo ricordo da custodire. Inizia con una foto, una voce o un video.",
      cta: "Crea il primo ricordo",
    },

    errors: {
      load: "Non è stato possibile caricare i ricordi. Riprova.",
    },
  },
}