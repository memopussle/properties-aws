import { Property } from "./Model";


export class MissingFieldError extends Error {

}


export function validateAsPropertyEntry(arg: any ) {
    // if address does not exist
    if (!(arg as Property).address) {
        throw new MissingFieldError('Value for address required!');
    } 

    if (!(arg as Property).status) {
      throw new MissingFieldError("Value for status required!");
    } 
    if (!(arg as Property).propertyId) {
      throw new MissingFieldError("Value for propertyId required!");
    } 

}