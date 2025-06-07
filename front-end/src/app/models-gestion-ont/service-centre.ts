import { Direction } from "./direction";


export interface ServiceCentre { 
  id : number;
  titre : string;
  id_direction: number;

}
export interface Listeservicedto { 
  id : number;
  titre : string;
  directionDto: Direction;

}