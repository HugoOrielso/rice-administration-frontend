import { Copyright, FileText, Home, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center text-sm text-slate-500 md:flex-row lg:px-8">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>
              +57 3138557993
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>andinagroup.comercial@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <p>
              CR 6 0 N 50 LOCAL 1 BARRIO FÁTIMA, VILLA DEL ROSARIO
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>NIT: 901460848-1</span>
          </div>
          <div className="flex items-center gap-2">
            <Copyright className="w-4 h-4" />
            <span>2026 Arroz Zulia - Andina Group & Capital S.A.S. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
