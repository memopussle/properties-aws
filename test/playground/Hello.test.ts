import { handler } from '../../services/PropertyTable/Create'

const event = {
    body: {
      address: "1 Avenue Auckland"
    }
} // passing event as argument in handler function

handler(event as any, {} as any)