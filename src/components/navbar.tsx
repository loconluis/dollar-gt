import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon, UserIcon } from "lucide-react"


const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 p-4 z-10 border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dólar en Guatemala</h1>
        <div className="flex space-x-4">
          <Dialog>
            <DialogTrigger>
              <InfoIcon className="text-gray-400 hover:text-white transition-colors" />
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-gray-300 border border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Descargo de responsabilidad
                </DialogTitle>
              </DialogHeader>
              <p>
                La aplicación proporciona información sobre el historial del
                tipo de cambio del dólar en Guatemala durante los últimos 30
                días. Los datos son proporcionados por el Banco Central de
                Guatemala. Aunque nos esforzamos por ofrecer información
                precisa y actualizada, no garantizamos la exactitud,
                integridad o actualidad de la información presentada. Los
                tipos de cambio pueden variar y dependen de múltiples
                factores. Esta aplicación no debe considerarse como asesoría
                financiera. Te recomendamos consultar a un profesional antes
                de tomar decisiones financieras basadas en la información aquí
                presentada. El uso de esta aplicación implica la aceptación de
                estos términos.
              </p>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <UserIcon className="text-gray-400 hover:text-white transition-colors" />
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-gray-300 border border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Información del autor
                </DialogTitle>
              </DialogHeader>
              <p>Creador por: Luis Locon</p>
              <p>
                Contact:{" "}
                <a href="https://x.com/loconluis" target="_blank">
                  @LoconLuis
                </a>
              </p>
              <p>GitHub: github.com/dollar-gt</p>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  )
}

export default Navbar