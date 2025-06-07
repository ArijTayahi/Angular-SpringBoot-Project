import { Grade } from "../pages/component-centre-formation/gestion-employe/grade";

export class Employe {

	id !: number ;
 nom !: string;
	prenom !: string;
	 password !: string;
	tlf !: string;
	 matricule !: string;
	 grade !: Grade ;
	adresse !: string;
	 email !: string;
	 avatar !: string;
	 dateNais !: Date;
id_service_centre !: number;
	  roles !: string [];

}
