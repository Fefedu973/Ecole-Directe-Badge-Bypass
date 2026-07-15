import * as React from "react"
import { CircleHelpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

const questions = [
  {
    question: "À quoi sert cet outil ?",
    answer:
      "Il permet de composer localement un aperçu visuel de badge lorsque vous avez besoin d'une maquette. Il ne remplace pas un badge officiel.",
  },
  {
    question: "Comment l'utiliser ?",
    answer:
      "Renseignez les champs, sélectionnez les jours de demi-pension, importez éventuellement une photo, puis ouvrez l'aperçu en plein écran.",
  },
  {
    question: "Comment quitter le plein écran ?",
    answer:
      "Appuyez deux fois en moins d'une demi-seconde sur la croix située en haut à droite du badge. Ce garde-fou évite une fermeture accidentelle.",
  },
  {
    question: "Pourquoi le plein écran est-il différent sur iPhone ?",
    answer:
      "iOS limite le plein écran des éléments web. L'outil utilise donc un affichage local de remplacement. Pour un meilleur résultat, vous pouvez ajouter le site à l'écran d'accueil.",
  },
  {
    question: "Comment ajouter ma photo ?",
    answer:
      "Importez une image depuis votre appareil puis recadrez-la. Il n'existe plus de connexion directe à ÉcoleDirecte et la photo n'est envoyée à aucun serveur.",
  },
  {
    question: "Ma classe n'est pas proposée.",
    answer:
      "Choisissez « Autre classe… » dans la liste, puis saisissez le libellé souhaité.",
  },
  {
    question: "Le code-barres fonctionne-t-il ?",
    answer:
      "Non. Le code-barres et le badge entier sont uniquement décoratifs et ne contiennent aucun identifiant fonctionnel.",
  },
  {
    question: "Mes informations sont-elles enregistrées ?",
    answer:
      "Oui, uniquement dans le stockage local de ce navigateur. Le bouton Réinitialiser permet de tout effacer et de revenir aux valeurs par défaut.",
  },
] as const

function FaqContent() {
  return (
    <div className="typeset typeset-faq">
      {questions.map(({ question, answer }) => (
        <React.Fragment key={question}>
          <h3>{question}</h3>
          <p>{answer}</p>
        </React.Fragment>
      ))}
    </div>
  )
}

export function FaqDialog() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const trigger = (
    <Button
      type="button"
      variant="ghost"
      aria-label="Ouvrir l'aide"
      onClick={() => setOpen(true)}
    >
      <CircleHelpIcon data-icon="inline-start" />
      <span className="hidden sm:inline">Aide</span>
    </Button>
  )

  if (isDesktop) {
    return (
      <>
        {trigger}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[min(80dvh,720px)] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Questions fréquentes</DialogTitle>
              <DialogDescription>
                Fonctionnement, confidentialité et limites de l'aperçu.
              </DialogDescription>
            </DialogHeader>
            <div className="min-h-0 overflow-y-auto pr-2">
              <FaqContent />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      {trigger}
      <Drawer
        open={open}
        onOpenChange={setOpen}
        showSwipeHandle
        swipeDirection="down"
      >
        <DrawerContent className="max-h-[85dvh]">
          <DrawerHeader>
            <DrawerTitle>Questions fréquentes</DrawerTitle>
            <DrawerDescription>
              Fonctionnement, confidentialité et limites de l'aperçu.
            </DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <FaqContent />
          </div>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline" />}>
              Fermer
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
